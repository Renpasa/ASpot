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
      const token = jwt.sign({ id: 1, username: 'testuser' }, process.env.JWT_SECRET as string);

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

    it('should return 400 if photo_url is invalid (junk, ftp, empty, non-image)', async () => {
      const token = jwt.sign({ id: 1, username: 'testuser' }, process.env.JWT_SECRET as string);

      const invalidUrls = [
        'ftp://example.com/image.jpg',
        '',
        'not-a-url',
        'https://example.com/doc.pdf',
        'https://example.com/doc.txt',
      ];

      for (const url of invalidUrls) {
        const response = await request(app)
          .post('/api/spots')
          .set('Authorization', `Bearer ${token}`)
          .send({
            place_id: 'place1',
            lat: 10,
            lng: 20,
            title: 'New Spot',
            photo_url: url,
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Please provide a valid image URL (must start with http/https and not be a non-image file type).');
      }
      expect(prismaMock.photoSpot.create).not.toHaveBeenCalled();
    });

    it('should return 201 and create a spot if token and valid data are provided (including seed/fallback URL shapes)', async () => {
      const token = jwt.sign({ id: 1, username: 'testuser' }, process.env.JWT_SECRET as string);

      const validUrls = [
        'http://example.com/1.jpg',
        'https://images.unsplash.com/photo-1543884849-0abcb65c1973?auto=format&fit=crop&q=80&w=300&h=200',
        'https://picsum.photos/seed/123/600/400',
        'https://example.com/image.png#fragment'
      ];

      for (let i = 0; i < validUrls.length; i++) {
        const mockSpot = {
          id: i + 1,
          user_id: 1,
          place_id: 'place1',
          lat: 10,
          lng: 20,
          title: 'New Spot',
          photo_url: validUrls[i],
          best_time: null,
          composition_tips: null,
          created_at: new Date(),
          updated_at: new Date(),
        };

        prismaMock.photoSpot.create.mockResolvedValueOnce(mockSpot as any);

        const response = await request(app)
          .post('/api/spots')
          .set('Authorization', `Bearer ${token}`)
          .send({
            place_id: 'place1',
            lat: 10,
            lng: 20,
            title: 'New Spot',
            photo_url: validUrls[i],
          });

        expect(response.status).toBe(201);
        expect(response.body.photo_url).toBe(validUrls[i]);
      }
      expect(prismaMock.photoSpot.create).toHaveBeenCalledTimes(validUrls.length);
    });

    it('should return 201 and create a spot if token and valid data are provided', async () => {
      const token = jwt.sign({ id: 1, username: 'testuser' }, process.env.JWT_SECRET as string);

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
