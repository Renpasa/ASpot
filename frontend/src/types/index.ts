export interface PhotoSpot {
  id: number;
  lat: number;
  lng: number;
  title: string;
  photo_url: string;
  best_time: string | null;
  composition_tips: string | null;
  user: {
    username: string;
  };
}

export interface CreateSpotPayload {
  lat: number;
  lng: number;
  title: string;
  photo_url: string;
  best_time?: string;
  composition_tips?: string;
}
