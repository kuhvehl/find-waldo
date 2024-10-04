import { useState } from "react";
import CharacterList from "./CharacterList";

const GameBoard = () => {
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [showCharacterList, setShowCharacterList] = useState(false);

  const characters = ["Sauron", "Frodo", "Nazgûl"];

  const handleImageClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setSelectedCoordinates({ x, y });
    setShowCharacterList(true);
  };

  const handleCharacterSelect = (character) => {
    console.log(
      `Selected character: ${character} at coordinates:`,
      selectedCoordinates
    );
    // Here you would typically send this data to your backend for validation
    setShowCharacterList(false);
  };

  const handleCancel = () => {
    setShowCharacterList(false);
    setSelectedCoordinates(null); // Hide the red circle as well
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
      {showCharacterList && (
        <CharacterList
          characters={characters}
          onSelectCharacter={handleCharacterSelect}
          onCancel={handleCancel}
          style={{
            position: "absolute",
            left: `${selectedCoordinates.x + 30}px`,
            top: `${selectedCoordinates.y + 30}px`,
            zIndex: 1000,
          }}
        />
      )}
    </div>
  );
};

export default GameBoard;
