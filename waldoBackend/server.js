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
  Sauron: { x: 7, y: 8, radius: 5 }, // Add radius
  Frodo: { x: 77, y: 37, radius: 5 }, // Add radius
  Nazgûl: { x: 50, y: 14, radius: 5 }, // Add radius
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
