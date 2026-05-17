import { Users, MessageCircle } from 'lucide-react';

export default function ChatList({ chats, currentChat, setCurrentChat, onCreateChat, onCreateGroup }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex gap-3">
          <button
            onClick={onCreateChat}
            className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-2xl font-medium flex items-center justify-center gap-2 transition"
          >
            <MessageCircle size={18} />
            New Chat
          </button>
          <button
            onClick={onCreateGroup}
            className="flex-1 border border-slate-700 hover:bg-slate-800 py-3 rounded-2xl font-medium flex items-center justify-center gap-2 transition"
          >
            <Users size={18} />
            New Group
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto chat-scroll p-3 space-y-1">
        {chats.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No chats yet.<br />Start a new conversation!
          </div>
        ) : (
          chats.map((chat) => {
            const isActive = currentChat?._id === chat._id;
            const isGroup = chat.isGroup;

            return (
              <div
                key={chat._id}
                onClick={() => setCurrentChat(chat)}
                className={`flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all hover:bg-slate-800 ${
                  isActive ? 'bg-slate-800' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl flex-shrink-0">
                  {isGroup ? chat.groupAvatar || '👥' : chat.participants?.[0]?.avatar || '👤'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold truncate">
                      {isGroup ? chat.groupName : chat.participants?.[0]?.name}
                    </p>
                    {chat.unread > 0 && (
                      <span className="bg-blue-600 text-white text-xs px-2.5 py-0.5 rounded-full">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 truncate mt-0.5">
                    {chat.lastMessage || 'No messages yet'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}