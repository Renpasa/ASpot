import { useEffect, useRef } from 'react';
import type { PhotoSpot } from '../types';

interface Props {
  spots: PhotoSpot[];
  selectedSpot: PhotoSpot | null;
  onSelectSpot: (spot: PhotoSpot) => void;
  hoveredSpotId: number | null;
  onHoverSpot: (spotId: number | null) => void;
}

export default function SpotList({ spots, selectedSpot, onSelectSpot, hoveredSpotId, onHoverSpot }: Props) {
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    if (selectedSpot && cardRefs.current[selectedSpot.id]) {
      cardRefs.current[selectedSpot.id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedSpot]);
  if (spots.length === 0) {
    return <div className="p-8 text-center text-gray-500">No photo spots available yet.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 break-inside-avoid">Photo Spots</h2>
      <div className="columns-1 sm:columns-2 xl:columns-3 gap-4">
      {spots.map(spot => {
        const isSelected = selectedSpot?.id === spot.id;
        const isHovered = hoveredSpotId === spot.id;
        const imageUrl = spot.photo_url || `https://picsum.photos/seed/${spot.id}/600/400`;

        return (
          <div
            key={spot.id}
            ref={el => { cardRefs.current[spot.id] = el; }}
            onClick={() => onSelectSpot(spot)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectSpot(spot);
              }
            }}
            onMouseEnter={() => onHoverSpot(spot.id)}
            onMouseLeave={() => onHoverSpot(null)}
            onFocus={() => onHoverSpot(spot.id)}
            onBlur={() => onHoverSpot(null)}
            tabIndex={0}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 border-2 break-inside-avoid inline-block w-full mb-4 ${
              isSelected
                ? 'border-blue-500 ring-2 ring-blue-200 transform scale-[1.02]'
                : isHovered
                  ? 'border-blue-300 shadow-lg scale-[1.01]'
                  : 'border-transparent hover:border-gray-300 hover:shadow-lg'
            }`}
          >
            <img
              src={imageUrl}
              alt={spot.title}
              className="w-full object-cover max-h-60"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${spot.id}/600/400`;
              }}
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{spot.title}</h3>

              <div className="mt-2 space-y-1">
                {spot.user?.username && (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">By:</span> {spot.user.username}
                  </p>
                )}

                {spot.best_time && (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">Best time:</span> {spot.best_time}
                  </p>
                )}
              </div>

              {spot.composition_tips && (
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-gray-700">Composition Tips:</h4>
                  <p className="text-sm text-gray-600 mt-1">{spot.composition_tips}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
