import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Leaderboard.css";
import confetti from "canvas-confetti";

function Leaderboard() {
  const { quizId } = useParams();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/leaderboard/${quizId}`)
      .then(res => {
        setPlayers(res.data);

        // 🎉 Trigger confetti if winner exists
        if (res.data.length > 0) {
          setTimeout(() => {
            confetti({
              particleCount: 200,
              spread: 120,
              origin: { y: 0.6 }
            });
          }, 500);
        }
      })
      .catch(err => {
        console.error("Error fetching leaderboard:", err);
      });
  }, [quizId]);

  const topThree = players.slice(0, 3);
  const remainingPlayers = players.slice(3);

  return (
    <div className="leaderboard-container">
      <h1 className="title">🏆 FINAL RESULTS</h1>

      {/* Podium Section */}
      <div className="podium">
        {/* 2nd Place */}
        {topThree[1] && (
          <div className="podium-item second">
            <div className="podium-rank">2</div>
            <h2>🥈</h2>
            <p className="podium-name">{topThree[1].student_name}</p>
            <span className="podium-score">{topThree[1].score} pts</span>
            {topThree[1].badge && (
              <span className="podium-badge">{topThree[1].badge}</span>
            )}
          </div>
        )}

        {/* 1st Place */}
        {topThree[0] && (
          <div className="podium-item first">
            <div className="podium-rank">1</div>
            <h2>🥇</h2>
            <p className="podium-name">{topThree[0].student_name}</p>
            <span className="podium-score">{topThree[0].score} pts</span>
            {topThree[0].badge && (
              <span className="podium-badge">{topThree[0].badge}</span>
            )}
          </div>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <div className="podium-item third">
            <div className="podium-rank">3</div>
            <h2>🥉</h2>
            <p className="podium-name">{topThree[2].student_name}</p>
            <span className="podium-score">{topThree[2].score} pts</span>
            {topThree[2].badge && (
              <span className="podium-badge">{topThree[2].badge}</span>
            )}
          </div>
        )}
      </div>

      {/* Full Leaderboard Table */}
      {players.length > 0 ? (
        <div className="leaderboard-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
                <th>Badge</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={index} className={index < 3 ? `top-${index + 1}` : ""}>
                  <td>
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                    {index > 2 && `#${index + 1}`}
                  </td>
                  <td>{player.student_name}</td>
                  <td>{player.score} pts</td>
                  <td>
                    {player.badge && (
                      <span className={`badge ${player.badge.toLowerCase().replace(' ', '-')}`}>
                        {player.badge}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-players">No players have taken this quiz yet.</p>
      )}
    </div>
  );
}

export default Leaderboard;