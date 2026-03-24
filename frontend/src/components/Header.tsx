import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onLoginClick: () => void;
}

export default function Header({ onLoginClick }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex-shrink-0 flex items-center">
          <span className="text-xl font-bold text-gray-800 tracking-tight">Aesthetic Spot</span>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm font-medium text-gray-700">
                Welcome, {user.username}
              </span>
              <button
                onClick={logout}
                className="text-sm font-semibold text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
