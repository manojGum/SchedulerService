const express = require("express");
const { messageController } = require("../controllers/messageController,js");


// router
const router = express.Router();
// routing
router.post("/message",messageController);

module.exports = router;
