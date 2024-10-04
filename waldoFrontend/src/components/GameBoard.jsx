import { useState } from "react";
import CharacterList from "./CharacterList";

const characterCoordinates = {
  Sauron: { x: 7, y: 8 },
  Frodo: { x: 77, y: 37 },
  Nazgûl: { x: 50, y: 14 },
};

const GameBoard = () => {
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [showCharacterList, setShowCharacterList] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const characters = Object.keys(characterCoordinates);

  const handleImageClick = (event) => {
    const img = event.target;
    const rect = img.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    setSelectedCoordinates({ xPercent, yPercent });
    setShowCharacterList(true);
    setValidationMessage("");
  };

  const handleCharacterSelect = (character) => {
    console.log(
      `Selected character: ${character} at normalized coordinates:`,
      selectedCoordinates
    );

    const correctCoordinates = characterCoordinates[character];

    if (
      selectedCoordinates &&
      Math.abs(selectedCoordinates.xPercent - correctCoordinates.x) < 10 &&
      Math.abs(selectedCoordinates.yPercent - correctCoordinates.y) < 10
    ) {
      setValidationMessage("Correct! You found the character.");
    } else {
      setValidationMessage("Incorrect! Try again.");
    }

    setShowCharacterList(false);
    setSelectedCoordinates(null);

    // Optionally, you could also reset after a few seconds
    setTimeout(() => {
      setValidationMessage("");
    }, 2000);
  };

  const handleCancel = () => {
    setShowCharacterList(false);
    setSelectedCoordinates(null);
  };

  return (
    <div className="game-board" style={{ position: "relative" }}>
      <img
        src="/src/assets/find-sauron.jpeg"
        alt="Find Sauron"
        onClick={handleImageClick}
        style={{ cursor: "crosshair", maxWidth: "100%" }}
      />
      {selectedCoordinates && (
        <div
          style={{
            position: "absolute",
            left: `calc(${selectedCoordinates.xPercent}% - 25px)`,
            top: `calc(${selectedCoordinates.yPercent}% - 25px)`,
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
            left: `calc(${selectedCoordinates.xPercent}% + 30px)`,
            top: `calc(${selectedCoordinates.yPercent}% + 30px)`,
            zIndex: 1000,
          }}
        />
      )}
      {validationMessage && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)", // Center the message
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "10px 15px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            fontSize: "18px",
            fontWeight: "bold",
            zIndex: 1000, // Ensure it's on top of other elements
            textAlign: "center", // Center the text
          }}
        >
          {validationMessage}
        </div>
      )}
    </div>
  );
};

export default GameBoard;
