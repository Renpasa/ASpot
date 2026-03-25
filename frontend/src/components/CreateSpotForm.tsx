import { useState } from 'react';
import type { CreateSpotPayload } from '../types';

interface CreateSpotFormProps {
  initialLat: number;
  initialLng: number;
  onSubmit: (data: CreateSpotPayload) => Promise<void>;
  onCancel: () => void;
}

export default function CreateSpotForm({
  initialLat,
  initialLng,
  onSubmit,
  onCancel,
}: CreateSpotFormProps) {
  const [title, setTitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [bestTime, setBestTime] = useState('');
  const [compositionTips, setCompositionTips] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !photoUrl.trim()) {
      setError('Title and Photo URL are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        lat: initialLat,
        lng: initialLng,
        title,
        photo_url: photoUrl,
        best_time: bestTime || undefined,
        composition_tips: compositionTips || undefined,
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Failed to create spot.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col bg-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Spot</h2>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 overflow-y-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location (Coordinates)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={initialLat.toFixed(6)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm"
              placeholder="Latitude"
            />
            <input
              type="text"
              readOnly
              value={initialLng.toFixed(6)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm"
              placeholder="Longitude"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Click on the map to change location.</p>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="E.g., Taipei 101 Sunset"
          />
        </div>

        <div>
          <label htmlFor="photoUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Photo URL *
          </label>
          <input
            id="photoUrl"
            type="url"
            required
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        <div>
          <label htmlFor="bestTime" className="block text-sm font-medium text-gray-700 mb-1">
            Best Time to Visit
          </label>
          <input
            id="bestTime"
            type="text"
            value={bestTime}
            onChange={(e) => setBestTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="E.g., Golden hour, early morning"
          />
        </div>

        <div>
          <label htmlFor="compositionTips" className="block text-sm font-medium text-gray-700 mb-1">
            Composition Tips
          </label>
          <textarea
            id="compositionTips"
            rows={4}
            value={compositionTips}
            onChange={(e) => setCompositionTips(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            placeholder="E.g., Use the leading lines of the road..."
          />
        </div>

        <div className="mt-auto pt-4 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {isSubmitting ? 'Saving...' : 'Save Spot'}
          </button>
        </div>
      </form>
    </div>
  );
}
