import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JoinQuiz.css";

function JoinQuiz() {

  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {

    if (!pin.trim()) {
      alert("Enter Quiz PIN");
      return;
    }

    if (!name.trim()) {
      alert("Enter your nickname");
      return;
    }

    navigate(`/quiz/${pin}`, {
      state: { student_name: name }
    });
  };

  return (
    <div className="join-container">

      <h1 className="join-title">Join Quiz</h1>

      <input
        className="join-input"
        type="text"
        placeholder="Enter Quiz PIN"
        value={pin}
        onChange={e => setPin(e.target.value)}
      />

      <input
        className="join-input"
        type="text"
        placeholder="Enter Nickname"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <button className="join-btn" onClick={handleJoin}>
        Join Game
      </button>

    </div>
  );
}

export default JoinQuiz;