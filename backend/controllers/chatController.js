const Chat = require('../models/Chat');

const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate('participants', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createChat = async (req, res) => {
  const { participants, isGroup, groupName, groupAvatar } = req.body;

  if (!participants || !Array.isArray(participants) || participants.length === 0) {
    return res.status(400).json({ message: 'Participants are required to create a chat' });
  }

  try {
    const chat = await Chat.create({
      participants: Array.from(new Set([...participants, req.user._id.toString()])),
      isGroup: !!isGroup,
      groupName: isGroup ? groupName : undefined,
      groupAvatar: isGroup ? groupAvatar : undefined
    });

    const populatedChat = await Chat.findById(chat._id).populate('participants', 'name email avatar');
    res.status(201).json(populatedChat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getChats, createChat };
