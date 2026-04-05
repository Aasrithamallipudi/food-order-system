import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={<DashboardPage />}
      />
      <Route
        path="/cart"
        element={<CartPage />}
      />
      <Route
        path="/orders"
        element={<OrdersPage />}
      />
      <Route
        path="/admin"
        element={<AdminPage />}
      />
    </Routes>
  );
}
