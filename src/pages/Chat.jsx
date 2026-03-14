import React from 'react';
import { useParams } from 'react-router-dom';
import ChatRoomList from '../components/Chat/ChatRoomList';
import ChatWindow from '../components/Chat/ChatWindow';

const Chat = () => {
  const { roomId } = useParams();

  return (
    <div className="flex bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200" style={{ height: 'calc(100vh - 180px)' }}>
      {/* Sidebar - Room List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 bg-gray-50 flex-shrink-0">
        <ChatRoomList />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white relative">
        {roomId ? (
          <ChatWindow roomId={roomId} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-blue-50 to-white">
            <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center text-5xl mb-6 animate-bounce">
              💬
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Conversations</h2>
            <p className="text-gray-500 max-w-sm">
              Select a chat from the sidebar to start messaging with employers about your applications.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 text-left">
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-white/50 p-3 rounded-xl border border-gray-100">
                <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">⚡</span>
                <span>Real-time messaging with employers</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-white/50 p-3 rounded-xl border border-gray-100">
                <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">📎</span>
                <span>Discuss job details and requirements</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
