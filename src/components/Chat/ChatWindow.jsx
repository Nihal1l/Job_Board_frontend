import React, { useEffect, useRef, useState } from 'react';
import useChatRoom from '../../hooks/useChatRoom';
import useAuthContext from '../../hooks/useAuthContext';

const statusColors = {
  connected: 'bg-green-400',
  connecting: 'bg-yellow-400 animate-pulse',
  disconnected: 'bg-gray-400',
  error: 'bg-red-500',
};

const statusLabels = {
  connected: 'Connected',
  connecting: 'Connecting…',
  disconnected: 'Disconnected',
  error: 'Connection error',
};

const ChatWindow = ({ roomId }) => {
  const { user } = useAuthContext();
  const { messages, sendMessage, connectionStatus } = useChatRoom(roomId);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isOwnMessage = (msg) =>
    msg.sender?.email === user?.email || msg.sender?.id === user?.id;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="px-6 py-3 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">Chat Room #{roomId}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${statusColors[connectionStatus]}`} />
          <span className="text-xs text-gray-500">{statusLabels[connectionStatus]}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="text-6xl mb-3">👋</div>
            <p className="text-gray-500 font-medium">No messages yet</p>
            <p className="text-gray-400 text-sm mt-1">Say hello to start the conversation!</p>
          </div>
        )}

        {messages.map((msg, idx) => {
          const own = isOwnMessage(msg);
          const time = msg.timestamp
            ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '';

          return (
            <div key={msg.id ?? idx} className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
              {/* Avatar for others */}
              {!own && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 self-end">
                  {(msg.sender?.email?.charAt(0) || 'U').toUpperCase()}
                </div>
              )}

              <div className={`max-w-xs lg:max-w-md xl:max-w-lg`}>
                {!own && (
                  <p className="text-xs text-gray-400 mb-1 ml-1">{msg.sender?.email || 'Participant'}</p>
                )}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    own
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                  }`}
                >
                  {msg.message}
                </div>
                <p className={`text-xs mt-1 text-gray-400 ${own ? 'text-right' : 'text-left'}`}>{time}</p>
              </div>

              {/* Avatar for own messages */}
              {own && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold ml-2 flex-shrink-0 self-end">
                  {(user?.email?.charAt(0) || 'Y').toUpperCase()}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={connectionStatus === 'connected' ? 'Type a message… (Enter to send)' : 'Waiting for connection…'}
            disabled={connectionStatus !== 'connected'}
            className="flex-1 resize-none px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{ maxHeight: '120px' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || connectionStatus !== 'connected'}
            className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
          >
            <svg className="w-5 h-5 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
