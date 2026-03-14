import authApiClient from './auth-api-client';

/** Fetch all chat rooms for the logged-in user */
export const getChatRooms = () => authApiClient.get('/chat/rooms/');

/** Create (or reuse) a chat room for a given applied-job application UUID */
export const createChatRoom = (applicationId) =>
  authApiClient.post('/chat/rooms/', { application: applicationId });

/** Fetch historical messages for a specific room */
export const getRoomMessages = (roomId) =>
  authApiClient.get(`/chat/rooms/${roomId}/messages/`);
