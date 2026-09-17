import { useEffect, useState, useCallback, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import type { MapMouseEvent } from '@vis.gl/react-google-maps';
import SpotList from '../components/SpotList';
import Header from '../components/Header';
import AuthModal from '../components/AuthModal';
import CreateSpotForm from '../components/CreateSpotForm';
import MarkersWithClustering from '../components/MarkersWithClustering';
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
  const [hoveredSpotId, setHoveredSpotId] = useState<number | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // Creation state
  const [isCreatingMode, setIsCreatingMode] = useState(false);
  const [newSpotLocation, setNewSpotLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [pendingAction, setPendingAction] = useState<'create' | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (user && pendingAction === 'create') {
      setIsCreatingMode(true);
      setPendingAction(null);
    }
  }, [user, pendingAction]);

  useEffect(() => {
    if (!user && isCreatingMode) {
      setIsCreatingMode(false);
      setNewSpotLocation(null);
    }
  }, [user, isCreatingMode]);

  useEffect(() => {
    // If the modal was closed, but the user is still not logged in,
    // they must have dismissed it. Clear the pending intent.
    if (!isAuthModalOpen && !user && pendingAction) {
      setPendingAction(null);
    }
  }, [isAuthModalOpen, user, pendingAction]);

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

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const toastTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const toggleCreatingMode = () => {
    if (!user) {
      setPendingAction('create');
      setIsAuthModalOpen(true);
      return;
    }
    
    setIsCreatingMode(!isCreatingMode);
    if (!isCreatingMode) {
      // Entering creation mode
      setSelectedSpot(null);
      setNewSpotLocation(null);
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
    setShowSuccessToast(true);
    clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <style>{`
        @keyframes map-bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
      `}</style>
      {showSuccessToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded shadow-lg font-medium transition-opacity">
          Spot successfully created!
        </div>
      )}
      <Header
        onLoginClick={() => setIsAuthModalOpen(true)}
        onAddSpotClick={toggleCreatingMode}
        isCreatingMode={isCreatingMode}
      />

      <div className="flex flex-col-reverse md:flex-row flex-1 overflow-hidden">
        <div className="w-full h-1/2 md:h-auto md:w-1/3 md:min-w-[300px] bg-gray-50 border-t md:border-t-0 md:border-r border-gray-200 overflow-y-auto">
          {isCreatingMode && user ? (
            <CreateSpotForm
              initialLat={newSpotLocation?.lat}
              initialLng={newSpotLocation?.lng}
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
                  hoveredSpotId={hoveredSpotId}
                  onHoverSpot={setHoveredSpotId}
                />
              )}
            </>
          )}
        </div>
        <div className="w-full h-1/2 md:h-auto md:w-2/3 flex-grow relative">
          {isCreatingMode && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg font-medium pointer-events-none transition-all text-center">
              {newSpotLocation 
                ? "Location selected. Complete the form to create your spot."
                : "Click on the map to select a spot location"}
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

              <MarkersWithClustering
                spots={spots}
                selectedSpotId={selectedSpot?.id || null}
                hoveredSpotId={hoveredSpotId}
                onSelectSpot={setSelectedSpot}
              />

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
