const express = require("express");
const messageRoutes = require("./routes/messageRoutes");
const dotenv = require("dotenv").config();
const cors = require('cors')
const app = express();


// middleware
app.use(cors())
app.use(express.json());
// ROUTES
app.use("/api/v1/bot", messageRoutes);
// Rest api
app.get("/", (req, res) => {
  res.send({
    message: "Hi Welcome to HR Assistance bot",
  });
});

// PORT
const PORT = process.env.PORT || 8586;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} `);
});
