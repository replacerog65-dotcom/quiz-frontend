import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Quiz from "./pages/Quiz";
import Leaderboard from "./pages/Leaderboard";
import CreateQuiz from "./pages/CreateQuiz";
import Dashboard from "./pages/Dashboard";
import JoinQuiz from "./pages/JoinQuiz";
function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/join" element={<JoinQuiz />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/quiz/:pin" element={<Quiz />} />
        <Route path="/leaderboard/:quizId" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;