const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const apiUrl = process.env.API_URL || '/api/v1.0.0/scheduler'
const schedulerRouters = require('../routers/scheduler')

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*
with the help of this middelware , we decide which router to send  according to the  user request.
*/

app.use(`${apiUrl}`,schedulerRouters)

module.exports = app;
