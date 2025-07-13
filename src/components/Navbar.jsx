import { useState, memo, useRef } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { ProductSearchBar } from "./form/SearchBar";
import { Dropdown } from "bootstrap";

const Navbar = memo(function Navbar({ cartData, allProducts }) {
  const location = useLocation();
  const showSearch = !["/", "/products", "/products/search"].includes(
    location.pathname
  );
  const showCartItem = !["/cart", "/checkout"].includes(location.pathname);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isLogoOpen, setIsLogoOpen] = useState(false);

  return (
    <div className="bg-white sticky-top">
      <div className="container">
        <div className="row mt-3">
          <div className="col-5">
            <nav className="navbar px-0 navbar-expand-lg navbar-light bg-white">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <NavItems />
            </nav>
          </div>

          <div className="navbar col-2 ">
            <NavLink
              className="navbar-brand position-absolute justify-content-center align-items-center m-0"
              onPointerEnter={() => setIsLogoOpen(true)}
              onPointerLeave={() => setIsLogoOpen(false)}
              to="/"
              data-testid="logo-link"
            >
              <img
                src={`${
                  isLogoOpen || location.pathname === "/"
                    ? "/images/logo_houseOpen.png"
                    : "/images/logo_house.png"
                }`}
                alt="貓狗の家 Logo"
                style={{
                  height: "60px",
                  width: "70px",
                  opacity: "0.25",
                  transform: "translate(0%, -15%)",
                }}
              />
              {/* <i
                className={`bi ${
                  isLogoOpen || location.pathname === "/"
                    ? "bi-house-door-fill"
                    : "bi-house-door"
                }`}
              ></i> */}
            </NavLink>
            <p className="fw-bold p-0 m-0">貓狗の家</p>
          </div>

          <div className="d-flex col-5 align-items-center justify-content-end">
            {showSearch && (
              <ProductSearchBar allProducts={allProducts} isPage={false} />
            )}

            <div
              className="nav-item position-relative m-2"
              onPointerEnter={() => setIsOrderOpen(true)}
              onPointerLeave={() => setIsOrderOpen(false)}
              data-testid="order-icon-hover"
            >
              <NavLink className="nav-link" to="/ordercheck">
                <i
                  className={`bi ${
                    isOrderOpen || location.pathname === "/ordercheck"
                      ? "bi-bag-fill"
                      : "bi-bag"
                  }`}
                  data-testid="order-icon"
                ></i>
              </NavLink>
            </div>

            <div
              className="nav-item position-relative m-2"
              onPointerEnter={() => setIsCartOpen(true)}
              onPointerLeave={() => setIsCartOpen(false)}
              data-testid="cart-icon-hover"
            >
              <NavLink className="nav-link" to="/cart">
                <i
                  className={`bi ${
                    isCartOpen && location.pathname !== "/cart"
                      ? "bi-cart-check"
                      : location.pathname === "/cart"
                      ? "bi-cart-check-fill"
                      : "bi-cart"
                  }`}
                  data-testid="cart-icon"
                ></i>
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  data-testid="cart-count-badge"
                >
                  {cartData?.carts?.length}
                </span>
              </NavLink>

              {isCartOpen && showCartItem && <CartItem cartData={cartData} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const NavItems = function NavItems() {
  const dropdownRef = useRef(null);

  const dropdownClose = () => {
    if (dropdownRef.current) {
      const dropdown = Dropdown.getInstance(dropdownRef.current);
      if (dropdown) {
        dropdown.hide();
      }
    }
  };

  return (
    <nav
      className="collapse navbar-collapse bg-white custom-header-md-open"
      id="navbarNav"
    >
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink className="nav-link ps-0" to="/about">
            關於我們
          </NavLink>
        </li>
        <li className="nav-item dropdown">
          <NavLink
            className="nav-link dropdown-toggle"
            to="/products?p=1"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            ref={dropdownRef}
          >
            產品列表
          </NavLink>
          <ul
            className="dropdown-menu"
            aria-labelledby="navbarDropdown"
            data-bs-auto-close="true"
          >
            <li>
              <Link
                className="dropdown-item"
                to="/products?p=1"
                onClick={dropdownClose}
              >
                全部產品
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item"
                to="/products?category=飼料"
                onClick={dropdownClose}
              >
                飼料
              </Link>
            </li>
            <li>
              <Link
                className="dropdown-item"
                to="/products?category=零食"
                onClick={dropdownClose}
              >
                零食
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

const CartItem = memo(function CartItem({ cartData }) {
  return (
    <div
      className="position-absolute top-100 end-0 bg-white border border-black custom-badge"
      style={{
        zIndex: "1000",
        width: "400px",
        maxWidth: "50vw",
      }}
    >
      <div
        className="row g-2 overflow-auto"
        style={{
          maxHeight: "70vh",
        }}
      >
        {cartData?.carts?.map((item) => {
          return (
            <div className="d-flex col-12 col-sm-6" key={item.id}>
              <div className="d-flex bg-light align-items-center">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="object-cover"
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                />
                <div
                  className="position-relative p-1"
                  style={{ minWidth: 0, fontSize: "0.8rem" }}
                >
                  <Link
                    to={`/products/${item.product.id}`}
                    className="mb-1 fw-bold d-block"
                    title={item.product.title}
                  >
                    {item.product.title}
                  </Link>
                  <div>
                    <span>
                      x{item.qty} NT${item.final_total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="d-flex mt-1 p-2 justify-content-between align-items-center border-top border-black">
        <div style={{ fontSize: "0.9rem" }}>
          <p className="mb-0 fw-bold">總金額</p>
          <p className="mb-0">NT${cartData.final_total}</p>
        </div>
        <div>
          <Link to="/cart" className="btn btn-dark rounded-3">
            GO
          </Link>
        </div>
      </div>
    </div>
  );
});

export { CartItem };

export default Navbar;
