const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

app.post("/api/game-sessions", async (req, res) => {
  try {
    const gameSession = await prisma.gameSession.create({
      data: {
        startTime: new Date(),
      },
    });
    res.json(gameSession.id);
  } catch (error) {
    res.status(500).json({ error: "Failed to create game session" });
  }
});

app.get("/api/characters", async (req, res) => {
  const { gameSessionId } = req.query;

  try {
    const allCharacters = await prisma.character.findMany();

    if (!gameSessionId) {
      return res.json(allCharacters);
    }

    const selectedCharacters = await prisma.characterSelection.findMany({
      where: {
        gameSessionId: parseInt(gameSessionId),
        isCorrect: true,
      },
      select: { characterId: true },
    });

    const selectedCharacterIds = selectedCharacters.map(
      (selection) => selection.characterId
    );

    const availableCharacters = allCharacters.filter(
      (character) => !selectedCharacterIds.includes(character.id)
    );

    res.json(availableCharacters);
  } catch (error) {
    console.error("Error fetching characters:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/validate", async (req, res) => {
  const { character, x, y, gameSessionId } = req.body;

  if (!character || x === undefined || y === undefined || !gameSessionId) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const characterData = await prisma.character.findUnique({
      where: { name: character },
      include: { locations: true },
    });

    if (!characterData) {
      return res.status(404).json({ error: "Character not found" });
    }

    const isCorrect = characterData.locations.some((location) => {
      const distance = Math.sqrt(
        Math.pow(x - location.x, 2) + Math.pow(y - location.y, 2)
      );
      return distance <= location.radius;
    });

    await prisma.characterSelection.create({
      data: {
        gameSessionId: gameSessionId,
        characterId: characterData.id,
        x,
        y,
        isCorrect: isCorrect,
        selectedAt: new Date(),
      },
    });

    const updatedSelections = await prisma.characterSelection.findMany({
      where: { gameSessionId },
      include: { character: true },
    });

    res.json({ updatedSelections });
  } catch (error) {
    console.error("Error validating character location:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

app.patch("/api/game-sessions/:id/end", async (req, res) => {
  const { id } = req.params;

  try {
    const gameSession = await prisma.gameSession.findUnique({
      where: { id: parseInt(id) },
    });

    if (!gameSession) {
      return res.status(404).json({ error: "Game session not found" });
    }

    const endTime = new Date();
    const duration = Math.floor((endTime - gameSession.startTime) / 1000); // Duration in seconds

    // Update the game session with endTime, duration, and completed status
    const updatedGameSession = await prisma.gameSession.update({
      where: { id: parseInt(id) },
      data: {
        completed: true,
        endTime,
        duration,
      },
    });

    res.json(updatedGameSession);
  } catch (error) {
    console.error("Error ending game session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/game-sessions/:id", async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  try {
    const updatedGameSession = await prisma.gameSession.update({
      where: { id: parseInt(id) },
      data: { user },
    });

    res.json(updatedGameSession);
  } catch (error) {
    console.error("Error updating game session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/game-sessions/top-scores", async (req, res) => {
  try {
    const topScores = await prisma.gameSession.findMany({
      orderBy: {
        duration: "asc",
      },
      take: 10,
      select: {
        user: true,
        startTime: true,
        endTime: true,
        duration: true,
      },
    });
    res.json(topScores);
  } catch (error) {
    console.error("Error fetching top scores:", error);
    res.status(500).json({ error: "Failed to fetch top scores" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
