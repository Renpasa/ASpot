import { useRef, useState } from 'react';
import type { PhotoSpot } from '../types';

// Local SVG placeholder: spot photos come from external hosts (Unsplash/Picsum)
// which can return 404/522; without a fallback the card image collapses to 0px.
const PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">' +
    '<rect width="600" height="400" fill="#e5e7eb"/>' +
    '<path d="M150 300l90-110 70 85 60-65 80 90z" fill="#9ca3af"/>' +
    '<circle cx="200" cy="130" r="26" fill="#9ca3af"/>' +
    '</svg>',
)}`;

interface Props {
  spot: PhotoSpot;
}

/**
 * Fixed 3:2 media area that never collapses: a failing photo URL falls back to
 * a committed inline SVG once, so layout stays stable offline or on 404/522.
 */
export default function SpotImage({ spot }: Props) {
  const [src, setSrc] = useState(spot.photo_url || PLACEHOLDER);
  const fallbackUsed = useRef(!spot.photo_url);

  return (
    <div className="aspect-[3/2] w-full overflow-hidden bg-gray-100">
      <img
        src={src}
        alt={spot.title}
        loading="lazy"
        data-testid="spot-image"
        className="h-full w-full object-cover"
        onError={() => {
          if (!fallbackUsed.current) {
            fallbackUsed.current = true;
            setSrc(PLACEHOLDER);
          }
        }}
      />
    </div>
  );
}
