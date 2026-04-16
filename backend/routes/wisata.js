const express = require("express");
const router = express.Router();

const readCSV = require("../utils/readCSV");

router.get("/", async (req, res) => {
  try {
    const data = await readCSV("./data/wisata.csv");
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Gagal membaca file CSV"
    });
  }
});

module.exports = router;