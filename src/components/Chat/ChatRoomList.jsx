import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getChatRooms } from '../../services/chat-service';

const ChatRoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getChatRooms()
      .then((res) => setRooms(res.data || []))
      .catch((err) => console.error('Failed to fetch chat rooms', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-12">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          <span>💬</span> Messages
        </h2>
        <p className="text-blue-100 text-xs mt-0.5">{rooms.length} conversation{rooms.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Room list */}
      <div className="flex-1 overflow-y-auto">
        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500 font-medium">No conversations yet</p>
            <p className="text-gray-400 text-sm mt-1">Start a chat from your Applications tab</p>
          </div>
        ) : (
          rooms.map((room) => {
            const isActive = String(room.id) === String(roomId);
            const jobTitle = room.job_title || room.application?.job_title || 'Job Application';
            const otherUser = room.employer_email || room.job_seeker_email || 'Participant';
            return (
              <button
                key={room.id}
                onClick={() => navigate(`/dashboard/chat/${room.id}`)}
                className={`w-full text-left px-4 py-4 border-b border-gray-100 transition-all duration-200 hover:bg-blue-50 ${
                  isActive ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {(otherUser?.charAt(0) || 'U').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{jobTitle}</p>
                    <p className="text-xs text-gray-500 truncate">{otherUser}</p>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatRoomList;
