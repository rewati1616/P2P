import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { Send, Paperclip, Smile } from 'lucide-react';

export default function ChatWindow({ 
  currentChat, 
  messages, 
  sendMessage, 
  user,
  messagesEndRef 
}) {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (messageText.trim()) {
      sendMessage(messageText.trim());
      setMessageText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // In production: upload file to backend using FormData + Multer/Cloudinary
    alert(`File upload simulation: ${file.name}\n(In real app this uses Multer + Cloudinary)`);
    
    // Simulate sending file message
    sendMessage(`📎 Sent a file: ${file.name}`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl">
            {currentChat.isGroup 
              ? currentChat.groupAvatar || '👥' 
              : currentChat.participants?.[0]?.avatar || '👤'}
          </div>
          <div>
            <h2 className="font-semibold text-lg">
              {currentChat.isGroup ? currentChat.groupName : currentChat.participants?.[0]?.name}
            </h2>
            <p className="text-xs text-emerald-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              {currentChat.isGroup ? `${currentChat.participants?.length || 0} members` : 'Online'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 text-slate-400">
          <button className="hover:text-white transition">Search</button>
          <button className="hover:text-white transition">Info</button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto chat-scroll p-6 bg-slate-950 space-y-6" ref={messagesEndRef}>
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg, index) => (
            <MessageBubble 
              key={msg._id || index} 
              message={msg} 
              isOwn={msg.sender === user._id || msg.sender?._id === user._id} 
            />
          ))
        )}
      </div>

      {/* Typing Indicator */}
      {isTyping && (
        <div className="px-6 py-2 text-sm text-slate-400 flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
          Someone is typing...
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <div className="flex items-center gap-3 bg-slate-800 rounded-3xl px-5 py-2">
          <button 
            onClick={() => fileInputRef.current.click()}
            className="text-slate-400 hover:text-blue-400 transition p-2"
          >
            <Paperclip size={22} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />

          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-transparent focus:outline-none text-base py-3 placeholder-slate-500"
          />

          <button
            onClick={handleSend}
            disabled={!messageText.trim()}
            className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 rounded-2xl flex items-center justify-center transition-all active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}