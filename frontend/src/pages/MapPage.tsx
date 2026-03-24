import { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import SpotList from '../components/SpotList';
import type { PhotoSpot } from '../types';
import { fetchSpots } from '../api/client';

const MapInteractivity = ({ selectedSpot }: { selectedSpot: PhotoSpot | null }) => {
  const map = useMap();

  useEffect(() => {
    if (map && selectedSpot) {
      map.panTo({ lat: selectedSpot.lat, lng: selectedSpot.lng });
      map.setZoom(15);
    }
  }, [map, selectedSpot]);

  return null;
};

export default function MapPage() {
  const [spots, setSpots] = useState<PhotoSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<PhotoSpot | null>(null);

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
        {!loading && !error && (
          <SpotList
            spots={spots}
            selectedSpot={selectedSpot}
            onSelectSpot={setSelectedSpot}
          />
        )}
      </div>
      <div className="w-2/3 flex-grow relative">
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
          <Map
            defaultCenter={{ lat: 25.0330, lng: 121.5654 }}
            defaultZoom={12}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            mapId="DEMO_MAP_ID"
          >
            <MapInteractivity selectedSpot={selectedSpot} />
            {spots.map(spot => {
              const imageUrl = spot.photo_url || `https://picsum.photos/seed/${spot.id}/600/400`;
              return (
                <AdvancedMarker
                  key={spot.id}
                  position={{ lat: spot.lat, lng: spot.lng }}
                  title={spot.title}
                  onClick={() => setSelectedSpot(spot)}
                >
                  <Pin
                    background={'#ffffff'}
                    borderColor={'#3b82f6'}
                    glyphColor={'#3b82f6'}
                  >
                     <img
                        src={imageUrl}
                        alt={spot.title}
                        className="w-10 h-10 object-cover rounded-full border-2 border-white shadow-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${spot.id}/600/400`;
                        }}
                     />
                  </Pin>
                </AdvancedMarker>
              );
            })}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
