import request from 'supertest';
import app from '../app';
import prisma from '../db';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy } from 'jest-mock-extended';

jest.mock('../db', () => {
  const { mockDeep } = require('jest-mock-extended');
  return {
    __esModule: true,
    default: mockDeep(),
  };
});

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('Spot Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/spots', () => {
    it('should return a list of spots', async () => {
      const mockSpots = [
        {
          id: 1,
          user_id: 1,
          place_id: 'place1',
          lat: 10,
          lng: 20,
          title: 'Spot 1',
          photo_url: 'http://example.com/1.jpg',
          best_time: null,
          composition_tips: null,
          created_at: new Date(),
          updated_at: new Date(),
          user: { username: 'testuser' },
        },
      ];

      prismaMock.photoSpot.findMany.mockResolvedValue(mockSpots as any);

      const response = await request(app).get('/api/spots');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Spot 1');
      expect(prismaMock.photoSpot.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /api/spots', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app).post('/api/spots').send({
        place_id: 'place1',
        lat: 10,
        lng: 20,
        title: 'New Spot',
        photo_url: 'http://example.com/1.jpg',
      });

      expect(response.status).toBe(401);
      expect(prismaMock.photoSpot.create).not.toHaveBeenCalled();
    });

    it('should return 400 if required fields are missing', async () => {
      const token = jwt.sign({ id: 1, username: 'testuser' }, process.env.JWT_SECRET || 'fallback_secret');

      const response = await request(app)
        .post('/api/spots')
        .set('Authorization', `Bearer ${token}`)
        .send({
          // 故意不帶 lat, lng, title, photo_url 等必填欄位
          place_id: 'place1',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'lat, lng, title, and photo_url are required');
      expect(prismaMock.photoSpot.create).not.toHaveBeenCalled();
    });

    it('should return 201 and create a spot if token and valid data are provided', async () => {
      const token = jwt.sign({ id: 1, username: 'testuser' }, process.env.JWT_SECRET || 'fallback_secret');

      const mockSpot = {
        id: 1,
        user_id: 1,
        place_id: 'place1',
        lat: 10,
        lng: 20,
        title: 'New Spot',
        photo_url: 'http://example.com/1.jpg',
        best_time: null,
        composition_tips: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      prismaMock.photoSpot.create.mockResolvedValue(mockSpot as any);

      const response = await request(app)
        .post('/api/spots')
        .set('Authorization', `Bearer ${token}`)
        .send({
          place_id: 'place1',
          lat: 10,
          lng: 20,
          title: 'New Spot',
          photo_url: 'http://example.com/1.jpg',
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('New Spot');
      expect(response.body.lat).toBe(10);
      expect(response.body.lng).toBe(20);
      expect(response.body.photo_url).toBe('http://example.com/1.jpg');
      expect(prismaMock.photoSpot.create).toHaveBeenCalledTimes(1);
    });
  });
});
