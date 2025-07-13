import { Route, Routes } from "react-router-dom";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminProduces from "./pages/admin/AdminProduces";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminOrders from "./pages/admin/AdminOrders";
import FrontLayout from "./pages/front/FrontLayout";
import Home from "./pages/front/Home";
import About from "./pages/front/About";
import Products from "./pages/front/Products";
import ProductsDetail from "./pages/front/ProductDetail";
import Cart from "./pages/front/Cart";
import Checkout from "./pages/front/Checkout";
import OrderCheck from "./pages/front/OrderCheck";
import Success from "./pages/front/Success";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<FrontLayout />}>
          <Route path="" element={<Home />}></Route>
          <Route path="about" element={<About />}></Route>
          <Route path="products" element={<Products />}></Route>
          <Route path="products/search" element={<Products />}></Route>
          <Route path="products/:id" element={<ProductsDetail />}></Route>
          <Route path="cart" element={<Cart />}></Route>
          <Route path="checkout" element={<Checkout />}></Route>
          <Route path="ordercheck" element={<OrderCheck />}></Route>
          <Route path="success/:orderId" element={<Success />}></Route>
        </Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/admin" element={<Dashboard />}>
          <Route path="products" element={<AdminProduces />}></Route>
          <Route path="coupons" element={<AdminCoupons />}></Route>
          <Route path="orders" element={<AdminOrders />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
