import { useState } from "react";
import CharacterList from "./CharacterList";
import StartGameModal from "./StartGameModal";
import { validateSelection, createGameSession } from "../utils/api"; // Add API call for game session

const characterCoordinates = {
  Sauron: "",
  Frodo: "",
  Nazgûl: "",
};

const GameBoard = () => {
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [showCharacterList, setShowCharacterList] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false); // New state to track game start
  const [gameSessionId, setGameSessionId] = useState(null); // Store game session ID
  const [guesses, setGuesses] = useState([]);

  const characters = Object.keys(characterCoordinates);

  const handleImageClick = (event) => {
    if (!gameStarted) return; // Ensure clicks are allowed only after the game starts
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
      selectedCoordinates,
      gameSessionId
    );

    if (selectedCoordinates && gameSessionId) {
      try {
        const response = await validateSelection(
          character,
          selectedCoordinates,
          gameSessionId // Pass the gameSessionId to the backend
        );

        // Get the updated guesses from the backend
        const updatedSelections = response.updatedSelections;

        // Update frontend to display the guesses
        setGuesses(updatedSelections); // Store the updated guesses in state

        // Update validation message based on the correctness of the last guess
        const lastSelection = updatedSelections[updatedSelections.length - 1];
        if (lastSelection.isCorrect) {
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

  // API call to start a new game session
  const startGame = async () => {
    try {
      const gameSessionId = await createGameSession(); // Get the ID directly
      setGameSessionId(gameSessionId); // Store the gameSessionId in state
      console.log("Game Session ID:", gameSessionId); // Log the gameSessionId to verify
      setGameStarted(true); // Hide modal and start game
    } catch (error) {
      console.log("Failed to start game session:", error);
    }
  };

  return (
    <div className="game-board" style={{ position: "relative" }}>
      {!gameStarted && <StartGameModal onStartGame={startGame} />}{" "}
      {/* Show modal if game not started */}
      <img
        src="/src/assets/find-sauron.jpeg"
        alt="Find Sauron"
        onClick={handleImageClick}
        style={{ cursor: "crosshair", maxWidth: "100%" }}
      />
      {/* Display guesses on the game board */}
      {guesses.map((guess, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `calc(${guess.x}% - 15px)`,
            top: `calc(${guess.y}% - 15px)`,
            width: "30px",
            height: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
            borderRadius: "50%",
            fontSize: "24px",
          }}
        >
          {guess.isCorrect ? "✅" : "❌"}
        </div>
      ))}
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
