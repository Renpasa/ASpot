import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import SpotList from '../components/SpotList';
import type { PhotoSpot } from '../types';

const mockSpots: PhotoSpot[] = [
  {
    id: 1,
    lat: 25.033964,
    lng: 121.564468,
    title: 'Taipei 101 View',
    photo_url: 'https://images.unsplash.com/photo-1543884849-0abcb65c1973?auto=format&fit=crop&q=80&w=300&h=200',
  },
  {
    id: 2,
    lat: 25.047924,
    lng: 121.517081,
    title: 'Taipei Main Station',
    photo_url: 'https://images.unsplash.com/photo-1572979261314-874e50eb9dd0?auto=format&fit=crop&q=80&w=300&h=200',
  },
  {
    id: 3,
    lat: 25.100913,
    lng: 121.547144,
    title: 'National Palace Museum',
    photo_url: 'https://images.unsplash.com/photo-1629864222045-81699f8d976f?auto=format&fit=crop&q=80&w=300&h=200',
  }
];

export default function MapPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="w-1/3 min-w-[300px] bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <SpotList spots={mockSpots} />
      </div>
      <div className="w-2/3 flex-grow">
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
          <Map
            defaultCenter={{ lat: 25.0330, lng: 121.5654 }}
            defaultZoom={12}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
          >
            {mockSpots.map(spot => (
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
