const Chat = require('../models/Chat');
const Message = require('../models/Message');

const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name email avatar')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const sendMessage = async (req, res) => {
  const { chat, content, fileUrl, fileType } = req.body;

  if (!chat || (!content && !fileUrl)) {
    return res.status(400).json({ message: 'Chat ID and message content or attachment required' });
  }

  try {
    const message = await Message.create({
      chat,
      sender: req.user._id,
      content,
      fileUrl,
      fileType
    });

    await Chat.findByIdAndUpdate(chat, {
      $addToSet: { participants: req.user._id }
    });

    const populatedMessage = await message.populate('sender', 'name email avatar');
    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markMessageAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { $addToSet: { readBy: req.user._id } },
      { new: true }
    );

    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markChatAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const result = await Message.updateMany(
      { chat: chatId, readBy: { $ne: req.user._id } },
      { $addToSet: { readBy: req.user._id } }
    );

    res.json({ updatedCount: result.modifiedCount ?? result.nModified });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await message.remove();
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getChatMessages,
  sendMessage,
  markMessageAsRead,
  markChatAsRead,
  deleteMessage
};
