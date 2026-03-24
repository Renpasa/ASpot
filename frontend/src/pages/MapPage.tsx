import { useEffect, useState } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import SpotList from '../components/SpotList';
import type { PhotoSpot } from '../types';
import { fetchSpots } from '../api/client';

export default function MapPage() {
  const [spots, setSpots] = useState<PhotoSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSpots = async () => {
      try {
        setLoading(true);
        const data = await fetchSpots();
        setSpots(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load spots:', err);
        setError('Failed to load spots. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadSpots();
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="w-1/3 min-w-[300px] bg-gray-50 border-r border-gray-200 overflow-y-auto">
        {loading && <div className="p-8 text-center text-gray-500">Loading spots...</div>}
        {error && <div className="p-8 text-center text-red-500">{error}</div>}
        {!loading && !error && <SpotList spots={spots} />}
      </div>
      <div className="w-2/3 flex-grow">
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
          <Map
            defaultCenter={{ lat: 25.0330, lng: 121.5654 }}
            defaultZoom={12}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
          >
            {spots.map(spot => (
              <Marker
                key={spot.id}
                position={{ lat: spot.lat, lng: spot.lng }}
                title={spot.title}
              />
            ))}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
