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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
