import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Quiz() {

  const { pin } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const studentName = location.state?.student_name || "Guest";

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);

  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState("");

  /* ================= FETCH QUIZ ================= */

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/quiz/${pin}`)
      .then(res => setQuiz(res.data))
      .catch(() => alert("Quiz not found"));
  }, [pin]);

  /* ================= TIMER ================= */

  useEffect(() => {
    if (!quiz || showFeedback) return;

    if (timeLeft === 0) {
      handleTimeOut();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);

  }, [timeLeft, quiz, showFeedback]);

  /* ================= TIMEOUT ================= */

  const handleTimeOut = () => {

    const currentQ = quiz.questions[currentQuestion];

    if (currentQ.question_type !== "poll") {
      setIsCorrect(false);
      setCorrectAnswer(currentQ.correct_answer);
      setShowFeedback(true);
    }

    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  /* ================= NEXT QUESTION ================= */

  const nextQuestion = () => {
    setShowFeedback(false);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(20);
    }
  };

  /* ================= SELECT ANSWER ================= */

  const handleSelect = (questionId, selected) => {

    if (showFeedback) return;

    const question = quiz.questions[currentQuestion];
    const timeTaken = 20 - timeLeft;

    let correct = false;

    if (question.question_type !== "poll") {
      correct = question.correct_answer === selected;
      setIsCorrect(correct);
      setCorrectAnswer(question.correct_answer);
      setShowFeedback(true);
    }

    setAnswers(prev => {
      const filtered = prev.filter(a => a.question_id !== questionId);
      return [
        ...filtered,
        {
          question_id: questionId,
          selected,
          time_taken: timeTaken,
          is_correct: correct
        }
      ];
    });

    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {

    if (answers.length !== quiz.questions.length) {
      alert("Please answer all questions!");
      return;
    }

    axios.post("http://127.0.0.1:8000/api/submit", {
      quiz_id: quiz.quiz_id,
      student_name: studentName,
      answers: answers
    })
    .then(res => {
      alert(`🎉 ${studentName}, Your Score: ${res.data.score}`);
      navigate(`/leaderboard/${quiz.quiz_id}`);
    })
    .catch(() => alert("Submission failed"));
  };

  if (!quiz) return <h2 style={{ padding: 40 }}>Loading...</h2>;

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>

      <h2>{quiz.title}</h2>
      <h3 style={{ color: "#007bff" }}>🎮 Player: {studentName}</h3>

      {/* Progress + Timer */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        background: "#f0f0f0",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px"
      }}>
        <span>
          Question {currentQuestion + 1} of {quiz.questions.length}
        </span>

        <span style={{
          fontWeight: "bold",
          color: timeLeft <= 5 ? "red" : "#333"
        }}>
          ⏳ {showFeedback ? "--" : `${timeLeft}s`}
        </span>
      </div>

      {/* Feedback */}
      {showFeedback && currentQ.question_type !== "poll" && (
        <div style={{
          textAlign: "center",
          padding: "20px",
          marginBottom: "20px",
          borderRadius: "10px",
          background: isCorrect ? "#d4edda" : "#f8d7da"
        }}>
          <h2 style={{ color: isCorrect ? "green" : "red" }}>
            {isCorrect ? "✅ Correct!" : "❌ Wrong!"}
          </h2>

          {!isCorrect && (
            <p>
              Correct answer: <strong>{correctAnswer}</strong>
            </p>
          )}
        </div>
      )}

      {/* Question Card */}
      <div style={{
        background: "#fafafa",
        padding: "25px",
        borderRadius: "12px"
      }}>

        {/* IMAGE */}
        {currentQ.image && (
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img
              src={`http://127.0.0.1:8000/storage/${currentQ.image}`}
              alt="Question"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "10px"
              }}
            />
          </div>
        )}

        <h3>{currentQ.question_text}</h3>

        {/* MULTIPLE */}
        {currentQ.question_type === "multiple" && (
          <OptionGrid
            options={[
              currentQ.option_a,
              currentQ.option_b,
              currentQ.option_c,
              currentQ.option_d
            ]}
            currentQ={currentQ}
            correctAnswer={correctAnswer}
            showFeedback={showFeedback}
            answers={answers}
            handleSelect={handleSelect}
          />
        )}

        {/* TRUE / FALSE */}
        {currentQ.question_type === "truefalse" && (
          <OptionGrid
            options={["True", "False"]}
            currentQ={currentQ}
            correctAnswer={correctAnswer}
            showFeedback={showFeedback}
            answers={answers}
            handleSelect={handleSelect}
          />
        )}

        {/* POLL */}
        {currentQ.question_type === "poll" && (
          <OptionGrid
            options={[
              currentQ.option_a,
              currentQ.option_b,
              currentQ.option_c,
              currentQ.option_d
            ].filter(Boolean)}
            currentQ={currentQ}
            correctAnswer={null}
            showFeedback={false}
            answers={answers}
            handleSelect={handleSelect}
          />
        )}

      </div>

      {/* Submit */}
      {currentQuestion === quiz.questions.length - 1 && (
        <div style={{ textAlign: "right", marginTop: "25px" }}>
          <button
            onClick={handleSubmit}
            disabled={answers.length !== quiz.questions.length}
            style={{
              padding: "15px 40px",
              fontSize: "18px",
              background:
                answers.length === quiz.questions.length
                  ? "#007bff"
                  : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "8px"
            }}
          >
            Submit Quiz
          </button>
        </div>
      )}

    </div>
  );
}

export default Quiz;


/* ================= OPTION GRID ================= */

function OptionGrid({
  options,
  currentQ,
  correctAnswer,
  showFeedback,
  answers,
  handleSelect
}) {

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "15px",
      marginTop: "20px"
    }}>
      {options.map((option, index) => {

        const selected = answers.find(a =>
          a.question_id === currentQ.id &&
          a.selected === option
        );

        const isCorrectOption = option === correctAnswer;

        return (
          <button
            key={index}
            onClick={() => handleSelect(currentQ.id, option)}
            disabled={showFeedback}
            style={{
              padding: "15px",
              borderRadius: "8px",
              border: "none",
              fontSize: "16px",
              cursor: showFeedback ? "default" : "pointer",
              background:
                showFeedback && correctAnswer
                  ? isCorrectOption
                    ? "#28a745"
                    : selected
                      ? "#dc3545"
                      : "#ddd"
                  : selected
                    ? "#007bff"
                    : "#ddd",
              color: selected || isCorrectOption ? "white" : "#333",
              transition: "0.3s ease"
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}