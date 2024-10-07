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

export const fetchCharacters = async (gameSessionId) => {
  try {
    const url = gameSessionId
      ? `${API_BASE_URL}/characters?gameSessionId=${gameSessionId}`
      : `${API_BASE_URL}/characters`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch characters");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching characters:", error);
    throw error;
  }
};

export const endGameSession = async (gameSessionId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/game-sessions/${gameSessionId}/end`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to end the game session");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in endGameSession:", error);
    throw error;
  }
};

export const updateGameSessionUser = async (gameSessionId, userName) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/game-sessions/${gameSessionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: userName }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update game session with name");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating game session:", error);
    throw error;
  }
};
