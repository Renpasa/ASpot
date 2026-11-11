import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onLoginClick: () => void;
  onAddSpotClick: () => void;
  isCreatingMode?: boolean;
}

export default function Header({ onLoginClick, onAddSpotClick, isCreatingMode }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8 min-h-16 py-2 sm:py-0 flex flex-wrap items-center justify-between gap-2">
        <div className="flex-shrink-0 flex items-center">
          <span className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight whitespace-nowrap">Aesthetic Spot</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <button
                onClick={onAddSpotClick}
                className={`text-xs sm:text-sm font-semibold px-2.5 py-1.5 sm:px-4 sm:py-2 whitespace-nowrap rounded-md transition-colors shadow-sm ${
                  isCreatingMode
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isCreatingMode ? 'Cancel Add Spot' : 'Add Spot'}
              </button>
              <span className="sr-only sm:not-sr-only sm:inline-block sm:max-w-[200px] sm:truncate text-sm font-medium text-gray-700">
                Welcome, {user.username}
              </span>
              <button
                onClick={logout}
                className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-2.5 py-1.5 sm:px-3 whitespace-nowrap transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onAddSpotClick}
                title="Login to add a spot"
                className="text-xs sm:text-sm font-semibold px-2.5 py-1.5 sm:px-4 sm:py-2 whitespace-nowrap rounded-md transition-colors shadow-sm bg-gray-200 text-gray-500 hover:bg-gray-300"
              >
                Add Spot
              </button>
              <button
                onClick={onLoginClick}
                className="bg-blue-600 text-white text-xs sm:text-sm font-semibold px-2.5 py-1.5 sm:px-4 sm:py-2 whitespace-nowrap rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                Login / Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
