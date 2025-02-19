import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import OrderHistory from "./components/OrderHistory";
import AdminDashboard from "./components/admin/AdminDashboard";
import { DashboardLayout } from "./components/admin/DashboardLayout";
import routes from "tempo-routes";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { WishlistProvider } from "./contexts/WishlistContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Suspense fallback={<p>Loading...</p>}>
            <>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route
                  path="/admin"
                  element={
                    <DashboardLayout>
                      <AdminDashboard />
                    </DashboardLayout>
                  }
                />
              </Routes>
              {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
            </>
          </Suspense>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
