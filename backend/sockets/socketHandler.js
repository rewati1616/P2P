const User = require('../models/User');
const Message = require('../models/Message');
const Chat = require('../models/Chat');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', async (userId) => {
      socket.userId = userId;
      await User.findByIdAndUpdate(userId, { isOnline: true, socketId: socket.id });
      io.emit('userStatus', { onlineUsers: await User.find({ isOnline: true }) });
    });

    socket.on('sendMessage', async (data) => {
      const message = await Message.create({
        chat: data.chat,
        sender: data.sender,
        content: data.content
      });

      io.to(`chat_${data.chat}`).emit('newMessage', message);
    });

    socket.on('disconnect', async () => {
      if (socket.userId) {
        await User.findByIdAndUpdate(socket.userId, { isOnline: false, lastSeen: Date.now() });
        io.emit('userStatus', { onlineUsers: await User.find({ isOnline: true }) });
      }
    });
  });
};