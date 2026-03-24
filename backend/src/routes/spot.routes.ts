import { Router } from 'express';
import { getSpots, getSpot, createSpot, updateSpot, deleteSpot } from '../controllers/spot.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', getSpots as any);
router.get('/:id', getSpot as any);

// Protected routes
router.post('/', authenticateToken as any, createSpot as any);
router.put('/:id', authenticateToken as any, updateSpot as any);
router.delete('/:id', authenticateToken as any, deleteSpot as any);

export default router;
