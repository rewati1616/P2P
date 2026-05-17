const express = require('express');
const {
  getChatMessages,
  sendMessage,
  markMessageAsRead,
  markChatAsRead,
  deleteMessage
} = require('../controllers/messageController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/:chatId', getChatMessages);
router.post('/', sendMessage);
router.put('/:messageId/read', markMessageAsRead);
router.put('/chat/:chatId/read', markChatAsRead);
router.delete('/:messageId', deleteMessage);

module.exports = router;
