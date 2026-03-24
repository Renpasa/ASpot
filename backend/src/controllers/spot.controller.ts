import { Request, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getSpots = async (req: Request, res: Response) => {
  try {
    const { ne_lat, sw_lat, ne_lng, sw_lng } = req.query;

    let whereClause = {};

    if (ne_lat && sw_lat && ne_lng && sw_lng) {
      whereClause = {
        lat: {
          lte: parseFloat(ne_lat as string),
          gte: parseFloat(sw_lat as string),
        },
        lng: {
          lte: parseFloat(ne_lng as string),
          gte: parseFloat(sw_lng as string),
        },
      };
    }

    const spots = await prisma.photoSpot.findMany({
      where: whereClause,
      include: {
        user: {
          select: { username: true }
        }
      }
    });

    res.json(spots);
  } catch (error) {
    console.error('Error fetching spots:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSpot = async (req: Request, res: Response) => {
  try {
    const spotId = parseInt(req.params.id as string);

    if (isNaN(spotId)) {
      return res.status(400).json({ error: 'Invalid spot ID' });
    }

    const spot = await prisma.photoSpot.findUnique({
      where: { id: spotId },
      include: {
        user: {
          select: { username: true }
        }
      }
    });

    if (!spot) {
      return res.status(404).json({ error: 'Spot not found' });
    }

    res.json(spot);
  } catch (error) {
    console.error('Error fetching spot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createSpot = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { place_id, lat, lng, title, photo_url, best_time, composition_tips } = req.body;

    if (lat === undefined || lng === undefined || !title || !photo_url) {
      return res.status(400).json({ error: 'lat, lng, title, and photo_url are required' });
    }

    const spot = await prisma.photoSpot.create({
      data: {
        user_id: userId,
        place_id,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        title,
        photo_url,
        best_time,
        composition_tips,
      },
    });

    res.status(201).json(spot);
  } catch (error) {
    console.error('Error creating spot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSpot = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const spotId = parseInt(req.params.id as string);

    if (isNaN(spotId)) {
        return res.status(400).json({ error: 'Invalid spot ID' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const spot = await prisma.photoSpot.findUnique({ where: { id: spotId } });

    if (!spot) {
      return res.status(404).json({ error: 'Spot not found' });
    }

    if (spot.user_id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You can only edit your own spots' });
    }

    const { place_id, lat, lng, title, photo_url, best_time, composition_tips } = req.body;

    const updateData: any = {};
    if (place_id !== undefined) updateData.place_id = place_id;
    if (lat !== undefined) updateData.lat = parseFloat(lat);
    if (lng !== undefined) updateData.lng = parseFloat(lng);
    if (title !== undefined) updateData.title = title;
    if (photo_url !== undefined) updateData.photo_url = photo_url;
    if (best_time !== undefined) updateData.best_time = best_time;
    if (composition_tips !== undefined) updateData.composition_tips = composition_tips;

    const updatedSpot = await prisma.photoSpot.update({
      where: { id: spotId },
      data: updateData,
    });

    res.json(updatedSpot);
  } catch (error) {
    console.error('Error updating spot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteSpot = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const spotId = parseInt(req.params.id as string);

    if (isNaN(spotId)) {
        return res.status(400).json({ error: 'Invalid spot ID' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const spot = await prisma.photoSpot.findUnique({ where: { id: spotId } });

    if (!spot) {
      return res.status(404).json({ error: 'Spot not found' });
    }

    if (spot.user_id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own spots' });
    }

    await prisma.photoSpot.delete({ where: { id: spotId } });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting spot:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
