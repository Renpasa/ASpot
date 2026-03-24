import type { PhotoSpot } from '../types';

interface Props {
  spots: PhotoSpot[];
}

export default function SpotList({ spots }: Props) {
  if (spots.length === 0) {
    return <div className="p-8 text-center text-gray-500">No photo spots available yet.</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Photo Spots</h2>
      {spots.map(spot => (
        <div
          key={spot.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {spot.photo_url && (
            <img src={spot.photo_url} alt={spot.title} className="w-full h-48 object-cover" />
          )}
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
      ))}
    </div>
  );
}
