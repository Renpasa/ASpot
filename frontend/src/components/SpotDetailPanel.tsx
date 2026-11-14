import type { PhotoSpot } from '../types';

interface Props {
  spot: PhotoSpot;
  onClear: () => void;
}

/**
 * Dedicated view for the currently selected spot.
 *
 * Before this panel existed, selecting a spot only highlighted a ~140px card in
 * the sidebar, so composition tips and coordinates were crammed into a narrow
 * column and locations were hard to inspect. The panel keeps the full-size
 * photo, notes, and coordinates in one readable block above the list.
 */
export default function SpotDetailPanel({ spot, onClear }: Props) {
  const imageUrl = spot.photo_url || `https://picsum.photos/seed/${spot.id}/1200/800`;

  return (
    <section
      data-testid="spot-detail-panel"
      aria-label={`Selected spot: ${spot.title}`}
      className="border-b border-gray-200 bg-white"
    >
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <h3 data-testid="spot-detail-title" className="text-lg font-semibold text-gray-900">
          {spot.title}
        </h3>
        <button
          type="button"
          onClick={onClear}
          data-testid="spot-detail-close"
          className="shrink-0 rounded border border-gray-300 px-2 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          Close
        </button>
      </div>

      <img
        src={imageUrl}
        alt={spot.title}
        className="mt-3 max-h-56 w-full object-cover"
        onError={(event) => {
          (event.target as HTMLImageElement).src = `https://picsum.photos/seed/${spot.id}/1200/800`;
        }}
      />

      <div className="space-y-2 px-4 py-4 text-sm text-gray-600">
        {spot.user?.username && (
          <p>
            <span className="font-medium text-gray-700">By:</span> {spot.user.username}
          </p>
        )}
        {spot.best_time && (
          <p>
            <span className="font-medium text-gray-700">Best time:</span> {spot.best_time}
          </p>
        )}
        {spot.composition_tips && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700">Composition tips</h4>
            <p data-testid="spot-detail-tips" className="mt-1 leading-relaxed text-gray-600">
              {spot.composition_tips}
            </p>
          </div>
        )}
        <p className="text-xs text-gray-500" data-testid="spot-detail-coordinates">
          {spot.lat.toFixed(5)}, {spot.lng.toFixed(5)}
        </p>
      </div>
    </section>
  );
}
