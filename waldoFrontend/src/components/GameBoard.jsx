import { useState } from "react";

const GameBoard = () => {
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  const handleImageClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setSelectedCoordinates({ x, y });
  };

  return (
    <div className="game-board" style={{ position: "relative" }}>
      <img
        src="/src/assets/find-sauron.jpeg"
        alt="Where's Waldo"
        onClick={handleImageClick}
        style={{ cursor: "crosshair", maxWidth: "100%" }}
      />
      {selectedCoordinates && (
        <div
          style={{
            position: "absolute",
            left: `${selectedCoordinates.x - 25}px`,
            top: `${selectedCoordinates.y - 25}px`,
            width: "50px",
            height: "50px",
            border: "2px solid red",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

export default GameBoard;
