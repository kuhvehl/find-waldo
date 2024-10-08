import { useEffect, useState } from "react";
import { fetchTopScores } from "../utils/api";

// eslint-disable-next-line react/prop-types
const StartGameModal = ({ onStartGame }) => {
  const [topScores, setTopScores] = useState([]);

  useEffect(() => {
    const loadTopScores = async () => {
      try {
        const scores = await fetchTopScores();
        setTopScores(scores);
      } catch (error) {
        console.error("Failed to load top scores:", error);
      }
    };

    loadTopScores();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center",
          maxWidth: "300px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h2>Find Frodo, Sauron, and The Nazgûl</h2>
        <h3>Fastest Players</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr 1fr",
            textAlign: "center",
            padding: "0",
            margin: "20px 0",
            width: "100%",
          }}
        >
          {topScores.map((score, index) => (
            <div
              key={index}
              style={{
                display: "contents",
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  fontWeight: "bold",
                }}
              >
                {index + 1}.
              </span>

              <span style={{ display: "flex", justifyContent: "center" }}>
                {score.user || "Anonymous"}
              </span>

              <span style={{ display: "flex", justifyContent: "flex-start" }}>
                {score.duration} s
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={onStartGame}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Play Now!
        </button>
      </div>
    </div>
  );
};

export default StartGameModal;
