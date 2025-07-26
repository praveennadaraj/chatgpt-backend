
const express = require("express");
const cors = require("cors");
const connectDB = require('./db');
require("dotenv").config();

const chatRoutes = require("./routes/chat");

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use("/api", chatRoutes);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

