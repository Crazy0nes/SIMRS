import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PasienDashboard from './pages/PasienDashboard';
import DokterDashboard from './pages/DokterDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pasien" element={<PasienDashboard />} />
      <Route path="/dokter" element={<DokterDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
