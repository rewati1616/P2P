export default function MessageBubble({ message, isOwn }) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] px-5 py-3 rounded-3xl ${
          isOwn 
            ? 'bg-blue-600 text-white rounded-br-sm' 
            : 'bg-slate-800 text-slate-100 rounded-bl-sm'
        }`}
      >
        <p className="text-[15px] leading-relaxed">{message.content}</p>
        
        {message.fileUrl && (
          <div className="mt-2 text-xs underline opacity-80">
            📎 View Attachment
          </div>
        )}

        <div className={`text-[10px] mt-2 opacity-70 text-right`}>
          {time}
        </div>
      </div>
    </div>
  );
}