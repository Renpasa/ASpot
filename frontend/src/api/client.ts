import axios from 'axios';
import type { PhotoSpot, CreateSpotPayload } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchSpots = async (): Promise<PhotoSpot[]> => {
  const response = await api.get<PhotoSpot[]>('/spots');
  return response.data;
};

export const createSpot = async (data: CreateSpotPayload): Promise<PhotoSpot> => {
  const response = await api.post<PhotoSpot>('/spots', data);
  return response.data;
};

export default api;
