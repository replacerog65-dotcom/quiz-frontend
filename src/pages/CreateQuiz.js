import { useState } from "react";
import axios from "axios";
import "./CreateQuiz.css";

function CreateQuiz() {

  const initialQuestion = {
    question_type: "multiple",
    question_text: "",
    image: null, // ✅ NEW
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: ""
  };

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ ...initialQuestion }]);
  const [loading, setLoading] = useState(false);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { ...initialQuestion }]);
  };

  const validateForm = () => {

    if (!title.trim()) {
      alert("Please enter quiz title.");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {

      if (!questions[i].question_text.trim()) {
        alert(`Question ${i + 1} text is required.`);
        return false;
      }

      if (questions[i].question_type === "multiple") {
        if (
          !questions[i].option_a ||
          !questions[i].option_b ||
          !questions[i].option_c ||
          !questions[i].option_d
        ) {
          alert(`All options are required for Question ${i + 1}.`);
          return false;
        }

        if (!questions[i].correct_answer) {
          alert(`Please select correct answer for Question ${i + 1}.`);
          return false;
        }
      }

      if (questions[i].question_type === "truefalse") {
        if (!questions[i].correct_answer) {
          alert(`Please select correct answer for Question ${i + 1}.`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = () => {

    if (!validateForm()) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);

    questions.forEach((q, index) => {

      formData.append(`questions[${index}][question_type]`, q.question_type);
      formData.append(`questions[${index}][question_text]`, q.question_text);
      formData.append(`questions[${index}][option_a]`, q.option_a || "");
      formData.append(`questions[${index}][option_b]`, q.option_b || "");
      formData.append(`questions[${index}][option_c]`, q.option_c || "");
      formData.append(`questions[${index}][option_d]`, q.option_d || "");
      formData.append(`questions[${index}][correct_answer]`, q.correct_answer || "");

      // ✅ Append image if exists
      if (q.image) {
        formData.append(`questions[${index}][image]`, q.image);
      }
    });

    axios.post("http://127.0.0.1:8000/api/create-quiz", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(res => {
      alert(`Quiz Created Successfully! PIN: ${res.data.pin}`);
      setTitle("");
      setQuestions([{ ...initialQuestion }]);
    })
    .catch(err => {
      console.log("ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Error creating quiz.");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="create-container">

      <div className="create-header">
        <h1 className="create-title">Create New Quiz</h1>

        <input
          className="quiz-title-input"
          type="text"
          placeholder="Enter Quiz Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      {questions.map((q, index) => (
        <div key={index} className="question-card">

          <h3>Question {index + 1}</h3>

          {/* Question Type */}
          <select
            className="correct-select"
            value={q.question_type}
            onChange={e => handleQuestionChange(index, "question_type", e.target.value)}
          >
            <option value="multiple">Multiple Choice</option>
            <option value="truefalse">True / False</option>
            <option value="poll">Poll</option>
          </select>

          {/* Question Text */}
          <input
            className="input-field"
            type="text"
            placeholder="Enter question text"
            value={q.question_text}
            onChange={e => handleQuestionChange(index, "question_text", e.target.value)}
          />

          {/* ✅ IMAGE UPLOAD */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleQuestionChange(index, "image", e.target.files[0])
            }
          />

          {/* Image Preview */}
          {q.image && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={URL.createObjectURL(q.image)}
                alt="Preview"
                style={{
                  maxWidth: "200px",
                  borderRadius: "8px"
                }}
              />
            </div>
          )}

          {/* MULTIPLE */}
          {q.question_type === "multiple" && (
            <>
              <div className="options-grid">
                <input placeholder="Option A"
                  value={q.option_a}
                  onChange={e => handleQuestionChange(index, "option_a", e.target.value)}
                />
                <input placeholder="Option B"
                  value={q.option_b}
                  onChange={e => handleQuestionChange(index, "option_b", e.target.value)}
                />
                <input placeholder="Option C"
                  value={q.option_c}
                  onChange={e => handleQuestionChange(index, "option_c", e.target.value)}
                />
                <input placeholder="Option D"
                  value={q.option_d}
                  onChange={e => handleQuestionChange(index, "option_d", e.target.value)}
                />
              </div>

              <select
                value={q.correct_answer}
                onChange={e => handleQuestionChange(index, "correct_answer", e.target.value)}
              >
                <option value="">Select Correct Answer</option>
                <option value={q.option_a}>Option A</option>
                <option value={q.option_b}>Option B</option>
                <option value={q.option_c}>Option C</option>
                <option value={q.option_d}>Option D</option>
              </select>
            </>
          )}

          {/* TRUE/FALSE */}
          {q.question_type === "truefalse" && (
            <>
              <div className="options-grid">
                <input value="True" disabled />
                <input value="False" disabled />
              </div>

              <select
                value={q.correct_answer}
                onChange={e => handleQuestionChange(index, "correct_answer", e.target.value)}
              >
                <option value="">Select Correct Answer</option>
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            </>
          )}

          {/* POLL */}
          {q.question_type === "poll" && (
            <p style={{ marginTop: "10px", color: "#6b7280" }}>
              Poll question (no correct answer required).
            </p>
          )}

        </div>
      ))}

      <div className="action-buttons">
        <button className="add-btn" onClick={addQuestion}>
          + Add Question
        </button>

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Quiz"}
        </button>
      </div>

    </div>
  );
}

export default CreateQuiz;