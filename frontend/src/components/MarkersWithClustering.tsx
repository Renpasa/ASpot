import { useEffect, useState, useRef } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Marker } from '@googlemaps/markerclusterer';
import type { PhotoSpot } from '../types';

type ClusterableMarker = Marker & { content?: Element | null };

interface MarkersWithClusteringProps {
  spots: PhotoSpot[];
  selectedSpotId: number | null;
  hoveredSpotId: number | null;
  onSelectSpot: (spot: PhotoSpot) => void;
}

export default function MarkersWithClustering({
  spots,
  selectedSpotId,
  hoveredSpotId,
  onSelectSpot
}: MarkersWithClusteringProps) {
  const map = useMap();
  const markerLibrary = useMapsLibrary('marker');
  const [markers, setMarkers] = useState<Record<number, ClusterableMarker>>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  // Store callbacks/state in refs so listeners always use latest without needing to recreate markers
  const onSelectSpotRef = useRef(onSelectSpot);
  useEffect(() => {
    onSelectSpotRef.current = onSelectSpot;
  }, [onSelectSpot]);

  // Initialize MarkerClusterer
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
    return () => {
      if (clusterer.current) {
        clusterer.current.clearMarkers();
        clusterer.current = null;
      }
    };
  }, [map]);

  // Initial creation of markers and clusterer integration
  // We use functional updates to setMarkers to avoid needing markers in the dependency array
  useEffect(() => {
    if (!map || !markerLibrary || !clusterer.current) return;

    setMarkers(prevMarkers => {
      // Determine which spots are new or removed
      const newMarkers: Record<number, ClusterableMarker> = { ...prevMarkers };
      const currentSpotIds = new Set(spots.map(s => s.id));
      let changed = false;
      
      // Remove old markers
      Object.keys(newMarkers).forEach((idStr) => {
        const id = parseInt(idStr, 10);
        if (!currentSpotIds.has(id)) {
          if (clusterer.current) clusterer.current.removeMarker(newMarkers[id]);
          delete newMarkers[id];
          changed = true;
        }
      });

      spots.forEach(spot => {
        if (!newMarkers[spot.id]) {
          changed = true;
          
          // Create new marker
          const pinElement = new markerLibrary.PinElement({
            background: '#ffffff',
            borderColor: '#3b82f6',
            glyphColor: '#3b82f6',
          });

          const marker = new markerLibrary.AdvancedMarkerElement({
            position: { lat: spot.lat, lng: spot.lng },
            title: spot.title,
            content: pinElement.element,
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          marker.addListener('click', (e: any) => {
            if (e && e.domEvent && typeof e.domEvent.stopPropagation === 'function') {
              e.domEvent.stopPropagation();
            } else if (e && typeof e.stop === 'function') {
              e.stop();
            }
            onSelectSpotRef.current(spot);
          });
          
          newMarkers[spot.id] = marker;
        }
      });
      
      if (changed) {
        if (clusterer.current) {
          clusterer.current.clearMarkers();
          clusterer.current.addMarkers(Object.values(newMarkers));
        }
        return newMarkers;
      }
      return prevMarkers;
    });
  }, [spots, map, markerLibrary]);

  // Update marker styles based on hover and selection state (fast path)
  useEffect(() => {
    if (!markerLibrary) return;
    
    spots.forEach(spot => {
      const marker = markers[spot.id];
      if (!marker) return;

      const isSelected = selectedSpotId === spot.id;
      const isHovered = hoveredSpotId === spot.id;
      
      const pinElement = new markerLibrary.PinElement({
        background: isSelected ? '#3b82f6' : isHovered ? '#60a5fa' : '#ffffff',
        borderColor: isSelected ? '#1d4ed8' : isHovered ? '#2563eb' : '#3b82f6',
        glyphColor: isSelected ? '#ffffff' : isHovered ? '#ffffff' : '#3b82f6',
        scale: isSelected ? 1.2 : isHovered ? 1.1 : 1.0,
      });

      if (isSelected || isHovered) {
        pinElement.element.style.animation = 'map-bounce 0.5s infinite alternate';
      } else {
        pinElement.element.style.animation = 'none';
      }

      marker.content = pinElement.element;
    });
  }, [spots, markers, selectedSpotId, hoveredSpotId, markerLibrary]);

  return null;
}
