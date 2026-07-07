import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Order from './pages/Order';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';
import Track from './pages/Track';
import Locations from './pages/Locations';
import AdminPage from './pages/Admin';
import ReportsPage from './pages/Reports';
import LoginPage from './pages/Login';
import { useAuth } from './context/AppContext';

function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="text-center py-20 text-gray-500">Memuat...</div>;
  if (!isAdmin) return <Navigate to="/login" replace />;
  return children;
}

function GuestModeCheck() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'guest') {
      console.log('Guest mode active');
    }
  }, []);
  return null;
}

export default function App() {
  return (
    <>
      <GuestModeCheck />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="order" element={<Order />} />
          <Route path="order/pay/new" element={<Payment />} />
          <Route path="order/success/:orderId" element={<OrderSuccess />} />
          <Route path="track" element={<Track />} />
          <Route path="locations" element={<Locations />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </>
  );
}
