const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const petsRoutes = require("./routes/pets");
const adoptionsRoutes = require("./routes/adoptions");

require("dotenv").config();

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/pets", petsRoutes);
app.use("/api/adoptions", adoptionsRoutes);

app.use(express.static(path.join(__dirname, "pages")));
app.use("/styles", express.static(path.join(__dirname, "styles")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
