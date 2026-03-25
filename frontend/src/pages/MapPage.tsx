import { useEffect, useState, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import type { MapMouseEvent } from '@vis.gl/react-google-maps';
import SpotList from '../components/SpotList';
import Header from '../components/Header';
import AuthModal from '../components/AuthModal';
import CreateSpotForm from '../components/CreateSpotForm';
import type { PhotoSpot, CreateSpotPayload } from '../types';
import { fetchSpots, createSpot } from '../api/client';
import { useAuth } from '../context/AuthContext';

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Creation state
  const [isCreatingMode, setIsCreatingMode] = useState(false);
  const [newSpotLocation, setNewSpotLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { user } = useAuth();

  const loadSpots = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadSpots();
  }, [loadSpots]);

  const handleMapClick = useCallback((e: MapMouseEvent) => {
    if (isCreatingMode && e.detail.latLng) {
      setNewSpotLocation({
        lat: e.detail.latLng.lat,
        lng: e.detail.latLng.lng,
      });
    } else {
       setSelectedSpot(null);
    }
  }, [isCreatingMode]);

  const toggleCreatingMode = () => {
    setIsCreatingMode(!isCreatingMode);
    if (!isCreatingMode) {
      // Entering creation mode
      setSelectedSpot(null);
      // Set a default location (e.g., center of Taipei) if user hasn't clicked yet
      setNewSpotLocation({ lat: 25.0330, lng: 121.5654 });
    } else {
      // Exiting creation mode
      setNewSpotLocation(null);
    }
  };

  const handleCreateSpotSubmit = async (data: CreateSpotPayload) => {
    await createSpot(data);
    await loadSpots();
    setIsCreatingMode(false);
    setNewSpotLocation(null);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <Header
        onLoginClick={() => setIsAuthModalOpen(true)}
        onAddSpotClick={toggleCreatingMode}
        isCreatingMode={isCreatingMode}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 min-w-[300px] bg-gray-50 border-r border-gray-200 overflow-y-auto">
          {isCreatingMode && user ? (
            <CreateSpotForm
              initialLat={newSpotLocation?.lat || 25.0330}
              initialLng={newSpotLocation?.lng || 121.5654}
              onSubmit={handleCreateSpotSubmit}
              onCancel={toggleCreatingMode}
            />
          ) : (
            <>
              {loading && <div className="p-8 text-center text-gray-500">Loading spots...</div>}
              {error && <div className="p-8 text-center text-red-500">{error}</div>}
              {!loading && !error && (
                <SpotList
                  spots={spots}
                  selectedSpot={selectedSpot}
                  onSelectSpot={setSelectedSpot}
                />
              )}
            </>
          )}
        </div>
        <div className="w-2/3 flex-grow relative">
          {isCreatingMode && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg font-medium pointer-events-none transition-all">
              請在地圖上點擊以選擇打卡位置
            </div>
          )}
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
            <Map
              defaultCenter={{ lat: 25.0330, lng: 121.5654 }}
              defaultZoom={12}
              gestureHandling={'greedy'}
              disableDefaultUI={true}
              mapId="DEMO_MAP_ID"
              onClick={handleMapClick}
              style={{ cursor: isCreatingMode ? 'crosshair' : 'default' }}
            >
              <MapInteractivity selectedSpot={selectedSpot} />

              {/* Existing spots */}
              {spots.map(spot => {
                const imageUrl = spot.photo_url || `https://picsum.photos/seed/${spot.id}/600/400`;
                return (
                  <AdvancedMarker
                    key={spot.id}
                    position={{ lat: spot.lat, lng: spot.lng }}
                    title={spot.title}
                    onClick={() => {
                      if (!isCreatingMode) setSelectedSpot(spot);
                    }}
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

              {/* Temporary marker for creation */}
              {isCreatingMode && newSpotLocation && (
                <AdvancedMarker
                  position={{ lat: newSpotLocation.lat, lng: newSpotLocation.lng }}
                  title="New Spot Location"
                >
                  <Pin
                    background={'#ef4444'}
                    borderColor={'#b91c1c'}
                    glyphColor={'#ffffff'}
                  />
                </AdvancedMarker>
              )}
            </Map>
          </APIProvider>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
