import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import Navbar from '../components/Navbar';

let socket;

export default function Home() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    socket = io('http://localhost:5000');
    socket.emit('join', user._id);

    socket.on('newMessage', (message) => {
      if (message.chat === currentChat?._id) {
        setMessages(prev => [...prev, message]);
      }
    });

    socket.on('userStatus', (data) => {
      setOnlineUsers(data.onlineUsers || []);
    });

    return () => socket.disconnect();
  }, [user, currentChat]);

  const sendMessage = (content) => {
    if (!currentChat || !content.trim()) return;

    const messageData = {
      chat: currentChat._id,
      sender: user._id,
      content: content.trim()
    };

    socket.emit('sendMessage', messageData);
    setMessages(prev => [...prev, { ...messageData, createdAt: new Date() }]);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Chat List */}
        <div className="w-80 border-r border-slate-800 bg-slate-900 flex flex-col">
          <ChatList 
            chats={chats} 
            currentChat={currentChat} 
            setCurrentChat={setCurrentChat} 
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-950">
          {currentChat ? (
            <ChatWindow 
              currentChat={currentChat}
              messages={messages}
              sendMessage={sendMessage}
              user={user}
              messagesEndRef={messagesEndRef}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <div className="text-7xl mb-6">💬</div>
                <p className="text-2xl font-medium">Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Online Users */}
        <div className="w-72 border-l border-slate-800 bg-slate-900 p-6 hidden lg:block">
          <h3 className="font-semibold text-lg mb-6">Online Users</h3>
          {onlineUsers.length === 0 ? (
            <p className="text-slate-500">No users online</p>
          ) : (
            onlineUsers.map(u => (
              <div key={u._id} className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-xl">
                  {u.avatar || '👤'}
                </div>
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-emerald-500 flex items-center gap-1">
                    ● Online
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}