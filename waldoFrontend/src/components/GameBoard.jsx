import { useState } from "react";
import CharacterList from "./CharacterList";
import { validateSelection } from "../utils/api";

const characterCoordinates = {
  Sauron: "",
  Frodo: "",
  Nazgûl: "",
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

  const handleCharacterSelect = async (character) => {
    console.log(
      `Selected character: ${character} at normalized coordinates:`,
      selectedCoordinates
    );

    if (selectedCoordinates) {
      try {
        const response = await validateSelection(
          character,
          selectedCoordinates
        );
        if (response.isCorrect) {
          setValidationMessage("Correct! You found the character.");
        } else {
          setValidationMessage("Incorrect! Try again.");
        }
      } catch (error) {
        console.log(error);
        setValidationMessage("Error validating selection.");
      }
    }

    setShowCharacterList(false);
    setSelectedCoordinates(null);

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
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "10px 15px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            fontSize: "18px",
            fontWeight: "bold",
            zIndex: 1000,
            textAlign: "center",
          }}
        >
          {validationMessage}
        </div>
      )}
    </div>
  );
};

export default GameBoard;
