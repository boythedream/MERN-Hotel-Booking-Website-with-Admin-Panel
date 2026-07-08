import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

import Home from "./pages/Home.jsx";
import Rooms from "./pages/Rooms.jsx";
import RoomDetails from "./pages/RoomDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Checkout from "./pages/Checkout.jsx";
import NotFound from "./pages/NotFound.jsx";

import Dashboard from "./pages/admin/Dashboard.jsx";
import ManageRooms from "./pages/admin/ManageRooms.jsx";
import ManageBookings from "./pages/admin/ManageBookings.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/checkout/:bookingId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

          <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/rooms" element={<AdminRoute><ManageRooms /></AdminRoute>} />
          <Route path="/admin/bookings" element={<AdminRoute><ManageBookings /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
