import { useState, useMemo, React } from "react";
import { Link, useOutletContext } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { createAsyncMessage } from "../../slice/messageSlice";
import { applyCoupon, clearCoupon } from "../../slice/couponSlice";
import { CartBottomBar } from "../../components/BottomBar";
import CouponInput from "../../components/form/CouponInput";

function Cart() {
  const apiPath = process.env.REACT_APP_APT_PATH;
  const { cartData, setCartData } = useOutletContext();
  const [loadingItems, setLoadingItems] = useState([]);
  const [isHoverTrash, setIsHoverTrash] = useState(false);
  const dispatch = useDispatch();
  const couponData = useSelector((state) => state.coupon);
  const [couponCode, setCouponCode] = useState("");
  const isCartEmpty = useMemo(() => cartData?.carts?.length === 0, [cartData]);
  const options = [...new Array(20)].map((_, num) => ({
    value: num + 1,
    label: num + 1,
  }));

  const removeCartItem = async (id) => {
    try {
      const res = await axios.delete(`/v2/api/${apiPath}/cart/${id}`);
      console.log(res);
      setCartData({
        ...cartData,
        carts: cartData.carts.filter((item) => item.id !== id),
      });
      dispatch(createAsyncMessage(res.data));
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
      console.log(error);
    }
  };

  const removeAllCartItem = async () => {
    try {
      const res = await axios.delete(`/v2/api/${apiPath}/carts`);
      console.log(res);
      setCartData({ carts: [], final_total: 0, total: 0 });
      dispatch(createAsyncMessage(res.data));
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
      console.log(error);
    }
  };

  const updateCartItem = async (item, quantity) => {
    const data = {
      data: {
        product_id: item.product_id,
        qty: Number(quantity),
      },
    };
    setLoadingItems([...loadingItems, item.id]);
    try {
      const res = await axios.put(`/v2/api/${apiPath}/cart/${item.id}`, data);
      console.log(res);
      console.log(loadingItems);
      const updateQty = cartData.carts.map((originItem) =>
        originItem.id === item.id
          ? { ...originItem, qty: Number(quantity) }
          : originItem
      );
      setCartData({
        ...cartData,
        carts: updateQty,
      });
      dispatch(createAsyncMessage(res.data));
    } catch (error) {
      console.log(error);
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      setLoadingItems(
        loadingItems.filter((loadingObject) => loadingObject !== item.id)
      );
    }
  };

  const handleCheckCoupon = (code) => {
    if (code === "") return;
    dispatch(applyCoupon(code));
  };

  const handleClearCoupon = () => {
    setCouponCode("");
    dispatch(clearCoupon("折扣碼已移除"));
  };

  return (
    <div className="container bg-light">
      <div className="row g-3 p-5">
        <div
          className="col-12 col-md-8 bg-light"
          style={{ minHeight: "calc(100vh - 56px - 76px)" }}
        >
          <div className="d-flex justify-content-center">
            <h4 className="mt-2">購物車內容</h4>
            {!isCartEmpty && (
              <button
                className="btn btn-white p-0 m-0"
                onClick={removeAllCartItem}
                style={{ cursor: "default" }}
                aria-label="刪除全部商品"
              >
                <i
                  className={`bi ${
                    isHoverTrash ? "bi-trash-fill" : "bi-trash"
                  }`}
                  onPointerEnter={() => setIsHoverTrash(true)}
                  onPointerLeave={() => setIsHoverTrash(false)}
                  style={{ cursor: "pointer" }}
                ></i>
              </button>
            )}
          </div>

          <div className="bg-white shadow-sm rounded-3">
            {isCartEmpty ? (
              <>
                <div className="alert alert-danger">還沒有選擇產品喔!!!</div>
                <Link
                  to="/products"
                  className="btn btn-dark w-100 mt-4 rounded-3 py-3"
                >
                  選購產品
                </Link>
              </>
            ) : (
              <>
                <div className="row g-2 p-1">
                  {cartData?.carts?.map((item, i) => {
                    return (
                      <div
                        className="col-12 col-md-6 d-flex mt-2 rounded-3 justify-content-center"
                        key={item.id}
                      >
                        <img
                          src={item.product.imageUrl}
                          alt=""
                          className="object-cover"
                          style={{
                            width: "60px",
                            height: "70px",
                          }}
                        />
                        <div className=" w-50 p-1 position-relative fs-6">
                          <button
                            type="button"
                            className="position-absolute btn"
                            style={{ top: "-5px", right: "-20px" }}
                            onClick={() => {
                              removeCartItem(item.id);
                            }}
                            aria-label={`刪除商品${i + 1}`}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                          <div style={{ fontSize: "0.7rem" }}>
                            <Link
                              to={`/products/${item.product.id}`}
                              className="mb-0 fw-bold"
                            >
                              {item.product.title}
                            </Link>
                            <p className="mb-1 text-muted">
                              {item.product.content}
                            </p>
                          </div>

                          <div
                            className="d-flex justify-content-between align-items-center w-100"
                            style={{ fontSize: "0.7rem" }}
                          >
                            <Select
                              options={options}
                              defaultValue={options.find(
                                (opt) => opt.value === item.qty
                              )}
                              isDisabled={loadingItems.includes(item.id)}
                              onChange={(selected) =>
                                updateCartItem(item, selected.value * 1)
                              }
                              styles={{
                                menu: (base) => ({
                                  ...base,
                                  zIndex: 1000,
                                }),
                                control: (base) => ({
                                  ...base,
                                  minWidth: "4rem",
                                }),
                              }}
                            />
                            <p className="mb-0 ms-auto">
                              NT$
                              {couponData.success
                                ? item.final_total
                                : item.total}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="col-12 col-md-4 bg-white shadow-sm rounded-3 h-25 mt-5">
          <div className="mt-2 p-1">
            <p>購物須知</p>
            <p className="p-0 m-0">1. 請於結帳前確認產品是否符合您的需求。</p>
            <p className="p-0 m-0"> 2. 請於結帳前確認產品數量是否選擇正確。</p>
          </div>
        </div>
      </div>
      {!isCartEmpty && (
        <CartBottomBar cartData={cartData} couponData={couponData}>
          <CouponInput
            id="coupon"
            type="text"
            labelText=""
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            checkCoupon={handleCheckCoupon}
            clearCoupon={handleClearCoupon}
            couponData={couponData}
          />
        </CartBottomBar>
      )}
    </div>
  );
}

export default Cart;
