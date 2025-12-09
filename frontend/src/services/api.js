import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskAPI = {
  createTask: async (title, description) => {
    const response = await api.post('/tasks', { title, description });
    return response.data;
  },

  getRecentTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  completeTask: async (id) => {
    const response = await api.patch(`/tasks/${id}/complete`);
    return response.data;
  },
};

export default api;

