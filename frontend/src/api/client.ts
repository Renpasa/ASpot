import axios from 'axios';
import type { PhotoSpot } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});

export const fetchSpots = async (): Promise<PhotoSpot[]> => {
  const response = await api.get<PhotoSpot[]>('/spots');
  return response.data;
};

export default api;
