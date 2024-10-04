const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Temporary storage for character locations
// In a real app, this would come from a database
const characterLocations = {
  Waldo: { x: 0.5, y: 0.5, radius: 0.05 },
  Wizard: { x: 0.2, y: 0.7, radius: 0.05 },
  Wilma: { x: 0.8, y: 0.3, radius: 0.05 },
};

app.post("/api/validate", (req, res) => {
  const { character, x, y } = req.body;

  if (!character || x === undefined || y === undefined) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const characterLocation = characterLocations[character];
  if (!characterLocation) {
    return res.status(404).json({ error: "Character not found" });
  }

  const distance = Math.sqrt(
    Math.pow(x - characterLocation.x, 2) + Math.pow(y - characterLocation.y, 2)
  );

  const isCorrect = distance <= characterLocation.radius;

  res.json({ isCorrect });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
