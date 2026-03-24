import type { PhotoSpot } from '../types';

interface Props {
  spots: PhotoSpot[];
  selectedSpot: PhotoSpot | null;
  onSelectSpot: (spot: PhotoSpot) => void;
}

export default function SpotList({ spots, selectedSpot, onSelectSpot }: Props) {
  if (spots.length === 0) {
    return <div className="p-8 text-center text-gray-500">No photo spots available yet.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Photo Spots</h2>
      {spots.map(spot => {
        const isSelected = selectedSpot?.id === spot.id;
        const imageUrl = spot.photo_url || `https://picsum.photos/seed/${spot.id}/600/400`;

        return (
          <div
            key={spot.id}
            onClick={() => onSelectSpot(spot)}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
              isSelected ? 'border-blue-500 ring-2 ring-blue-200 transform scale-[1.02]' : 'border-transparent hover:border-gray-300 hover:shadow-lg'
            }`}
          >
            <img
              src={imageUrl}
              alt={spot.title}
              className="w-full h-48 object-cover"
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
  );
}
