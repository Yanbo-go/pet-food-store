import { memo } from "react";
import { Link } from "react-router-dom";

export const CartBottomBar = memo(function Navbar({
  cartData,
  couponData,
  children,
}) {
  return (
    <div
      className="sticky-bottom shadow-lg p-1 mt-5 bg-body rounded"
      style={{ zIndex: 999 }}
    >
      <div className="row d-flex p-2 " style={{ fontSize: "0.8rem" }}>
        <div className="d-flex col-12 col-md-6 justify-content-end justify-content-md-center">
          <div className="m-2">折扣碼:</div>
          <div className="">{children}</div>
        </div>
        <div className="d-flex col-12 col-md-6 align-items-center justify-content-end justify-content-md-center">
          <div className="px-4">
            <span className="mb-0 fw-bold">總金額:</span>
            <span className="mb-0 fw-bold">
              NT$
              {couponData.success ? couponData.discountedTotal : cartData.total}
            </span>
          </div>
          <Link to="/checkout" className="btn btn-dark rounded-3">
            前往結帳
          </Link>
        </div>
      </div>
    </div>
  );
});
