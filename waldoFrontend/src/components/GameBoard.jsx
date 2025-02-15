import { useState, useEffect } from "react";
import CharacterList from "./CharacterList";
import StartGameModal from "./StartGameModal";
import NameModal from "./NameModal";
import {
  validateSelection,
  createGameSession,
  fetchCharacters,
  endGameSession,
  updateGameSessionUser,
} from "../utils/api";

const GameBoard = () => {
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [showCharacterList, setShowCharacterList] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSessionId, setGameSessionId] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleNameSubmit = async (name) => {
    if (gameSessionId) {
      try {
        // eslint-disable-next-line no-unused-vars
        const updatedGameSession = await updateGameSessionUser(
          gameSessionId,
          name
        );

        setIsModalVisible(false);
        setGameSessionId("");
      } catch (error) {
        console.error("Error updating game session:", error);
      }
    } else {
      console.error("No Game Session ID available");
    }
  };

  useEffect(() => {
    if (gameSessionId && !gameStarted) {
      setIsModalVisible(true);
    }
  }, [gameSessionId, gameStarted]);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const characterData = await fetchCharacters();
        setCharacters(characterData);
      } catch (error) {
        console.error("Error loading characters:", error);
      }
    };

    loadCharacters();
  }, []);

  const handleImageClick = (event) => {
    if (!gameStarted) return;
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
    if (selectedCoordinates && gameSessionId) {
      try {
        const response = await validateSelection(
          character,
          selectedCoordinates,
          gameSessionId
        );

        const updatedSelections = response.updatedSelections;
        setGuesses(updatedSelections);

        const availableCharacters = await fetchCharacters(gameSessionId);
        setCharacters(availableCharacters);

        if (availableCharacters.length === 0) {
          await endGameSession(gameSessionId);
          setValidationMessage("Game completed!");
          setGameStarted(false);
        } else {
          const lastSelection = updatedSelections[updatedSelections.length - 1];
          if (lastSelection.isCorrect) {
            setValidationMessage("Correct! You found the character.");
          } else {
            setValidationMessage("Incorrect! Try again.");
          }
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

  const startGame = async () => {
    try {
      const gameSessionId = await createGameSession();
      setGameSessionId(gameSessionId);
      setGameStarted(true);
      const characterData = await fetchCharacters();
      setGuesses([]);
      setCharacters(characterData);
    } catch (error) {
      console.log("Failed to start game session:", error);
    }
  };

  return (
    <div className="game-board" style={{ position: "relative" }}>
      <NameModal onSubmit={handleNameSubmit} isVisible={isModalVisible} />
      {!gameStarted && !gameSessionId && (
        <StartGameModal onStartGame={startGame} />
      )}{" "}
      <img
        src="/find-sauron.jpeg"
        alt="Find Sauron"
        onClick={handleImageClick}
        style={{ cursor: "crosshair", maxWidth: "100%" }}
      />
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
