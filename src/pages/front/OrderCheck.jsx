import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Loading from "../../components/Loading";
import { motion } from "framer-motion";

function Ordercheck() {
  const { getOrder, orderData, setOrderData, isLoading } = useOutletContext();

  useEffect(() => {
    return () => {
      if (orderData) setOrderData({});
    };
  }, []);

  return (
    <>
      <Loading isLoading={isLoading} />

      <div className="container p-5">
        <div className="row flex-md-row-reverse flex-column justify-content-center">
          <div className="col-md-5">
            <img
              src="https://images.unsplash.com/photo-1549141022-6b68900e53af?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="img-fluid object-cover"
              alt="..."
            />
          </div>
          <div className="col-md-5 d-flex flex-column justify-content-center md-0 mt-3">
            <h2 className="fw-bold">訂單查詢</h2>
            <h5 className="font-weight-normal text-muted mt-2"></h5>
            <Search getOrder={getOrder} isLoading={isLoading} />
          </div>
        </div>

        {orderData.success && <OrderInfoCard order={orderData.order} />}
      </div>
    </>
  );
}

const Search = ({ width = "auto", getOrder, isLoading }) => {
  const [searchId, setSearchId] = useState("");
  const [searchStatus, setSearchStatus] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const orderIdData = { orderId: searchId, source: "orderCheck" };
    if (!searchId.trim()) {
      setSearchStatus(true);
      return;
    }

    getOrder(orderIdData);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchId(value);

    if (value.trim()) {
      setSearchStatus(false);
    }
  };

  return (
    <>
      <div className="position-relative input-group" style={{ width: width }}>
        <input
          type="text"
          className={`form-control rounded-3  ${searchStatus && "is-invalid"}`}
          placeholder="搜尋訂單..."
          value={searchId}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
          onChange={handleSearchChange}
          disabled={isLoading}
        />

        <div className="input-group-append">
          <button
            className="btn btn-dark rounded-3"
            type="button"
            id="search"
            onClick={handleSearch}
          >
            搜尋
          </button>
        </div>

        {searchStatus && <div className="invalid-feedback">請輸入訂單號碼</div>}
      </div>
    </>
  );
};

const OrderInfoCard = ({ order }) => {
  return (
    <motion.div
      className="container my-4 p-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="card shadow  border-secondary">
        <div className="card-header  bg-secondary text-white fs-5 fw-bold d-flex justify-content-center align-items-center">
          <i className="bi bi-receipt-cutoff me-2"></i>
          訂單查詢結果
        </div>
        <div className="card-body p-4">
          <div className="row justify-content-center text-center mb-3">
            <div className="col-md-5 mb-2">
              <i className="bi bi-hash fw-bold me-2 text-secondary"></i>
              <span className="fw-bold">訂單號碼:</span>
              <div>{order.id}</div>
            </div>
            <div className="col-md-5 mb-2">
              <i className="bi bi-cash-coin fw-bold me-2 text-secondary"></i>
              <span className="fw-bold">付款狀態:</span>
              <div
                className={`fw-semibold ${
                  order.is_paid ? "text-success" : "text-danger"
                }`}
              >
                <i
                  className={`bi me-1 ${
                    order.is_paid ? "bi-check-circle-fill" : "bi-x-circle-fill"
                  }`}
                ></i>
                {order.is_paid ? "已付款" : "未付款"}
              </div>
            </div>
            <div className="col-md-5 mb-2">
              <i className="bi bi-person-circle fw-bold me-2 text-secondary"></i>
              <span className="fw-bold">訂購人:</span>
              <div>{order.user.name}</div>
            </div>
            <div className="col-md-5 mb-2">
              <i className="bi bi-currency-dollar fw-bold me-2 text-secondary"></i>
              <span className="fw-bold">總金額:</span>
              <div className="text-primary fw-bold">
                NT${order.total.toLocaleString()}
              </div>
            </div>
          </div>

          <hr />

          <h5 className="fw-bold text-center mb-3">
            <i className="bi bi-box-seam me-2 text-secondary"></i>
            購買產品明細
          </h5>

          <motion.ul
            className="list-group"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
            }}
          >
            {Object.values(order?.products || {}).map((product, index) => (
              <motion.li
                key={index}
                className="row list-group-item d-flex justify-content-center align-items-center text-center"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <div className="col-sm-5">
                  <div className="fw-semibold">{product.product.title}</div>
                  <small className="text-muted">數量: {product.qty}</small>
                </div>
                <div className="col-sm-5 fw-bold text-success">
                  {product.total === product.final_total ? (
                    <p className="mb-0 ms-auto">
                      NT$
                      {product.total.toLocaleString()}
                    </p>
                  ) : (
                    <>
                      <p className="m-0 text-decoration-line-through">
                        NT$
                        {product.total.toLocaleString()}
                      </p>
                      <p className="m-0 ms-auto">
                        NT$
                        {product.final_total.toLocaleString()}
                      </p>
                    </>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </motion.div>
  );
};

export default Ordercheck;
