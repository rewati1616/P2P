// frontend/src/config/api.js

const BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: `${BASE_URL}/auth/signup`,
    LOGIN: `${BASE_URL}/auth/login`,
    ME: `${BASE_URL}/auth/me`,
  },
  // You can add more endpoints later
  CHATS: {
    GET_CHATS: `${BASE_URL}/chats`,
    CREATE_CHAT: `${BASE_URL}/chats`,
  },
  MESSAGES: {
    GET_MESSAGES: (chatId) => `${BASE_URL}/messages/${chatId}`,
  }
};

export default API_ENDPOINTS;