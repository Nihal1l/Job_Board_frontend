import { useEffect, useState, useCallback } from 'react';
import { getChatRooms, getRoomMessages } from '../services/chat-service';
import useAuthContext from './useAuthContext';

const useUnreadCount = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      const roomsRes = await getChatRooms();
      const rooms = roomsRes.data || [];
      
      let totalUnread = 0;
      
      // Get the read timestamps from localStorage
      const readStatusRaw = localStorage.getItem('chatReadStatus');
      const readStatus = readStatusRaw ? JSON.parse(readStatusRaw) : {};

      // Fetch messages for all rooms
      const messagesPromises = rooms.map(room => getRoomMessages(room.id).catch(() => ({ data: [] })));
      const messagesResults = await Promise.all(messagesPromises);

      rooms.forEach((room, index) => {
        const messages = messagesResults[index].data || [];
        const lastSeen = readStatus[room.id] ? new Date(readStatus[room.id]) : new Date(0);
        
        // Count messages that are newer than lastSeen and not sent by the user
        const unreadForRoom = messages.filter(msg => {
          const isOwn = msg.sender?.email === user?.email || msg.sender?.id === user?.id;
          if (isOwn) return false;
          
          const msgTime = new Date(msg.timestamp);
          return msgTime > lastSeen;
        }).length;
        
        totalUnread += unreadForRoom;
      });

      setUnreadCount(totalUnread);
    } catch (err) {
      console.error('Failed to fetch unread count', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch immediately and poll every 30 seconds
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    
    // Custom event listener so we can trigger a refresh manually
    const handleRefresh = () => fetchUnreadCount();
    window.addEventListener('refreshUnreadCount', handleRefresh);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshUnreadCount', handleRefresh);
    };
  }, [fetchUnreadCount]);

  return { unreadCount, loading, fetchUnreadCount };
};

export default useUnreadCount;
