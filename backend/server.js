const express = require("express");
const cors = require("cors");

const wisataRoutes = require("./routes/wisata");
const itineraryRoutes = require("./routes/itinerary");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/wisata", wisataRoutes);
app.use("/api/itinerary", itineraryRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});