const express = require("express");
const Tesseract = require("tesseract.js");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Tesseract OCR API is live.");
});

app.post("/ocr", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).send({ error: "Image URL is required." });

    const response = await fetch(url);
    const buffer = await response.buffer();

    Tesseract.recognize(buffer, "eng")
      .then(({ data: { text } }) => {
        res.send({ text });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send({ error: "OCR failed." });
      });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 OCR API running on port ${PORT}`));
