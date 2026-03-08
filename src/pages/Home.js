import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (pin) {
      navigate(`/quiz/${pin}`);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🎮 Join Quiz</h1>
      <input
        type="text"
        placeholder="Enter Quiz PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />
      <br /><br />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
}

export default Home;