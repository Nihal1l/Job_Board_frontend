import { useEffect, useRef, useState, useCallback } from 'react';
import { getRoomMessages } from '../services/chat-service';
import { WS_BASE_URL } from '../config';

const useChatRoom = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const wsRef = useRef(null);
  useEffect(() => {
    if (!roomId) return;

    let ws;
    let cancelled = false;

    const connect = async () => {
      setConnectionStatus('connecting');
      setMessages([]);

      // 1. Fetch historical messages
      try {
        const res = await getRoomMessages(roomId);
        if (!cancelled) {
          setMessages(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load message history', err);
      }

      if (cancelled) return;

      // 2. Open WebSocket
      const token = (() => {
        const raw = localStorage.getItem('authTokens');
        return raw ? JSON.parse(raw)?.access : null;
      })();

      if (!token) {
        setConnectionStatus('error');
        return;
      }

      ws = new WebSocket(`${WS_BASE_URL}/${roomId}/?token=${token}`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!cancelled) setConnectionStatus('connected');
      };

      ws.onmessage = (event) => {
        if (cancelled) return;
        try {
          const data = JSON.parse(event.data);
          setMessages((prev) => {
            // Avoid duplicates by id (backend echoes saved message back)
            if (prev.some((m) => m.id === data.id)) return prev;
            return [...prev, data];
          });
        } catch {
          // non-JSON control frames – ignore
        }
      };

      ws.onerror = () => {
        if (!cancelled) setConnectionStatus('error');
      };

      ws.onclose = () => {
        if (!cancelled) setConnectionStatus('disconnected');
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [roomId]);

  const sendMessage = useCallback((text) => {
    if (!text?.trim()) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message: text.trim() }));
    }
  }, []);

  return { messages, sendMessage, connectionStatus };
};

export default useChatRoom;
