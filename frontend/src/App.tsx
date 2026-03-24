import MapPage from './pages/MapPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <MapPage />
    </AuthProvider>
  );
}

export default App;
