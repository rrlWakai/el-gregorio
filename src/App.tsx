import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AdminReservationsPage from '@/pages/AdminReservationsPage';
import AdminCalendarPage from '@/pages/AdminCalendarPage';
import AdminRoomsPage from '@/pages/AdminRoomsPage';
import AdminReviewsPage from '@/pages/AdminReviewsPage';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />

        {/* Admin auth */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="reservations" element={<AdminReservationsPage />} />
          <Route path="calendar" element={<AdminCalendarPage />} />
          <Route path="rooms" element={<AdminRoomsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
