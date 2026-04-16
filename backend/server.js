const express = require("express");
const cors = require("cors");

const wisataRoutes = require("./routes/wisata");
const itineraryRoutes = require("./routes/itinerary");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/wisata", wisataRoutes);
app.use("/api/itinerary", itineraryRoutes);

app.listen(5000, () => {
  console.log("Server jalan di port 5000");
});
