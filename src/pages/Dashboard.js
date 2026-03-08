import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [showQuizzes, setShowQuizzes] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/quizzes")
      .then(res => setQuizzes(res.data))
      .catch(err => console.error("Error fetching quizzes:", err));
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    axios.delete(`http://127.0.0.1:8000/api/quiz/${id}`)
      .then(() => {
        setQuizzes(quizzes.filter(q => q.id !== id));
      })
      .catch(err => console.error("Error deleting quiz:", err));
  };

  const handleEdit = (quiz) => {
    const newTitle = prompt("Enter new quiz title:", quiz.title);
    if (!newTitle || newTitle.trim() === "") return;

    axios.put(`http://127.0.0.1:8000/api/quiz/${quiz.id}`, {
      title: newTitle
    })
    .then(() => {
      setQuizzes(quizzes.map(q =>
        q.id === quiz.id ? { ...q, title: newTitle } : q
      ));
    })
    .catch(err => console.error("Error updating quiz:", err));
  };

  const totalQuizzes = quizzes.length;
  const totalAttempts = quizzes.reduce((sum, q) => sum + q.attempts_count, 0);

  return (
    <div className="dashboard-wrapper">
      <div className="sidebar">
        <h2>QuizAdmin</h2>

        <ul>
          {/* Collapsible Dashboard */}
          <li
            className="menu-item"
            onClick={() => setShowQuizzes(!showQuizzes)}
          >
            Dashboard {showQuizzes ? "▼" : "▶"}
          </li>

          {/* Dropdown Quizzes */}
          {showQuizzes && (
            <ul className="submenu">
              {quizzes.map(q => (
                <li
                  key={q.id}
                  className="submenu-item"
                  onClick={() => navigate(`/leaderboard/${q.id}`)}
                >
                  📘 {q.title}
                </li>
              ))}
            </ul>
          )}

          <li
            className="menu-item"
            onClick={() => navigate("/create-quiz")}
          >
            + Create Quiz
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1>Instructor Dashboard</h1>
          <button onClick={() => navigate("/create-quiz")} className="create-btn">
            + Create Quiz
          </button>
        </div>

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{totalQuizzes}</h3>
            <p>Total Quizzes</p>
          </div>
          <div className="stat-card">
            <h3>{totalAttempts}</h3>
            <p>Total Attempts</p>
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="quiz-grid">
          {quizzes.map(q => (
            <div key={q.id} className="quiz-card">
              <h3>{q.title}</h3>
              <p>PIN: <strong>{q.pin}</strong></p>
              <p>Questions: {q.questions_count || 0}</p>
              <p>Attempts: {q.attempts_count || 0}</p>

              <div style={{ marginTop: "10px", display: "flex", gap: "10px", justifyContent: "center" }}>
                <button
                  className="view-btn"
                  onClick={() => navigate(`/leaderboard/${q.id}`)}
                >
                  View
                </button>

                <button
                  className="edit-btn"
                  onClick={() => handleEdit(q)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(q.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;