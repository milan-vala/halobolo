import { useContext } from "react";
import AppContext from "./context/AppContext";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AuthLayout from "./components/AuthLayout";
import UnauthLayout from "./components/UnauthLayout";
import { NotMatch } from "./pages/NotMatch";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";

function App() {
  const { isLoggedIn } = useContext(AppContext);
  // console.log("is logged in ==>", isLoggedIn);

  return (
    <Routes>
      <Route path="/">
        <Route index element={<LoginPage />} />
      </Route>
      <Route>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotMatch />} />
    </Routes>
  );
}

export default App;
