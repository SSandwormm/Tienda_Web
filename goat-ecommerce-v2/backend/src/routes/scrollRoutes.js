const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  const folder = path.join(process.cwd(), "uploads", "scroll-animation");

  const files = fs
    .readdirSync(folder)
    .sort()
    .map((file) => `http://localhost:5000/uploads/scroll-animation/${file}`);

  res.json(files);
});

module.exports = router;
