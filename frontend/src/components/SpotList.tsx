import type { PhotoSpot } from '../types';

interface Props {
  spots: PhotoSpot[];
}

export default function SpotList({ spots }: Props) {
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
          </div>
        </div>
      ))}
    </div>
  );
}
