const API_BASE_URL = "http://localhost:3000/api";

export const createGameSession = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/game-sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to create game session");
    }

    const gameSessionId = await response.json();

    return gameSessionId;
  } catch (error) {
    console.error("Error in createGameSession:", error);
    throw error;
  }
};

export const validateSelection = async (
  character,
  coordinates,
  gameSessionId
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        character,
        x: coordinates.xPercent,
        y: coordinates.yPercent,
        gameSessionId,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error validating selection:", error);
    throw error;
  }
};
