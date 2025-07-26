const express = require("express");
const messageController = require('../controller/messageController')
const router = express.Router();
router.post("/chat",messageController.getMessage );

router.put("/rename/:sessionId", messageController.renameSession);

router.delete("/delete/:id", messageController.deleteMessage);
router.get("/sessions", messageController.getSessions);
router.get("/history/:sessionId", messageController.getSessionMessages);

module.exports = router;

