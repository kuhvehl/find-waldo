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
    console.log(gameSession);
    res.json(gameSession.id);
  } catch (error) {
    res.status(500).json({ error: "Failed to create game session" });
  }
});

app.post("/api/validate", async (req, res) => {
  console.log(req.body);
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

    // Calculate if the selected location is correct
    const isCorrect = characterData.locations.some((location) => {
      const distance = Math.sqrt(
        Math.pow(x - location.x, 2) + Math.pow(y - location.y, 2)
      );
      return distance <= location.radius;
    });

    // Record the selection in the database
    await prisma.characterSelection.create({
      data: {
        gameSessionId: gameSessionId,
        characterId: characterData.id,
        isCorrect: isCorrect,
        selectedAt: new Date(), // Optional, it defaults to `now()`
      },
    });

    // Respond with the validation result
    res.json({ isCorrect });
  } catch (error) {
    console.error("Error validating character location:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start game session
app.post("/api/game-sessions", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const gameSession = await prisma.gameSession.create({
      data: {
        userId: parseInt(userId),
        startTime: new Date(),
      },
    });

    res.json(gameSession);
  } catch (error) {
    console.error("Error creating game session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// End game session
app.put("/api/game-sessions/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const endTime = new Date();
    const gameSession = await prisma.gameSession.update({
      where: { id: parseInt(id) },
      data: {
        endTime,
        completed: true,
        duration: {
          set: prisma.raw(
            `EXTRACT(EPOCH FROM ("endTime" - "startTime"))::integer`
          ),
        },
      },
    });

    res.json(gameSession);
  } catch (error) {
    console.error("Error updating game session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Record character selection
app.post("/api/character-selections", async (req, res) => {
  const { gameSessionId, characterId, isCorrect } = req.body;

  if (!gameSessionId || !characterId || isCorrect === undefined) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const characterSelection = await prisma.characterSelection.create({
      data: {
        gameSessionId: parseInt(gameSessionId),
        characterId: parseInt(characterId),
        isCorrect,
      },
    });

    res.json(characterSelection);
  } catch (error) {
    console.error("Error recording character selection:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
