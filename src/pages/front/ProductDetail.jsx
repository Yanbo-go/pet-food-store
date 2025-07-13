import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../../slice/messageSlice";

function ProductsDetail() {
  const apiPath = process.env.REACT_APP_APT_PATH;
  const [product, setProduct] = useState({});
  const [cartQuantity, setCartQuantity] = useState(1);
  const { id } = useParams();
  const [isDataUpdata, setIsDataUpdata] = useState(false);
  const { getCart, cartData, isLoading, setIsLoading } = useOutletContext();
  const cartFilterData = cartData?.carts?.filter(
    (item) => item.product_id === id
  );
  const dispatch = useDispatch();

  const getProduct = async (id) => {
    setIsLoading(true);
    try {
      const productRes = await axios.get(`/v2/api/${apiPath}/product/${id}`);
      setProduct(productRes.data.product);
    } catch (error) {
      dispatch(createAsyncMessage(error.response?.data));
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async () => {
    const data = {
      data: {
        product_id: product.id,
        qty: cartQuantity,
      },
    };

    if ((cartFilterData[0]?.qty || 0) + cartQuantity > 20) {
      dispatch(
        createAsyncMessage({
          message: `訂購數量已達上限，可訂數量=${20 - cartFilterData[0].qty}`,
        })
      );
      return;
    }

    setIsDataUpdata(true);

    try {
      const res = await axios.post(`/v2/api/${apiPath}/cart`, data);
      getCart();
      dispatch(createAsyncMessage(res.data));
      setCartQuantity(1);
    } catch (error) {
      dispatch(createAsyncMessage(error.response?.data));
    } finally {
      setIsDataUpdata(false);
    }
  };

  useEffect(() => {
    getProduct(id);
  }, [id]);

  return (
    <>
      <Loading isLoading={isLoading} />

      <div className="container">
        <div className="text-center img-fluid ">
          <img
            src={product.imageUrl}
            alt=""
            className="object-cover"
            style={{
              minHeight: "500px",
              width: "500px",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
        <div className="row justify-content-between mt-4 mb-7">
          <div className="col-md-7">
            <h2 className="mb-0">{product.title}</h2>
            <p className="fw-bold">NT${product.price}</p>
            <p>{product.content}</p>
            {/* <div className="my-4">
              <img src="https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1916&q=80" alt="" className="img-fluid mt-4" />
              <img src="https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1916&q=80" alt="" className="img-fluid mt-4" />
              <img src="https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1916&q=80" alt="" className="img-fluid mt-4" />
            </div> */}
            {/* <div className="accordion border border-bottom border-top-0 border-start-0 border-end-0 mb-3" id="accordionExample">
              <div className="card border-0">
                <div className="card-header py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0" id="headingOne" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                  <div className="d-flex justify-content-between align-items-center pe-1">
                    <h4 className="mb-0">
                      Lorem ipsum
                    </h4>
                    <i className="fas fa-minus"></i>
                  </div>
                </div>
                <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div className="card-body pb-5">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
                  </div>
                </div>
              </div>
              <div className="card border-0">
                <div className="card-header py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0" id="headingTwo" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                  <div className="d-flex justify-content-between align-items-center pe-1">
                    <h4 className="mb-0">
                      Lorem ipsum
                    </h4>
                    <i className="fas fa-plus"></i>
                  </div>
                </div>
                <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                  <div className="card-body pb-5">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
                  </div>
                </div>
              </div>
              <div className="card border-0">
                <div className="card-header py-4 bg-white border border-bottom-0 border-top border-start-0 border-end-0" id="headingThree" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                  <div className="d-flex justify-content-between align-items-center pe-1">
                    <h4 className="mb-0">
                      Lorem ipsum
                    </h4>
                    <i className="fas fa-plus"></i>
                  </div>
                </div>
                <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                  <div className="card-body pb-5">
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
                  </div>
                </div>
              </div>
            </div> */}
          </div>
          <div className="col-md-4">
            <div className="input-group mb-3 border mt-3">
              <div className="input-group-prepend">
                <button
                  className="btn btn-outline-dark rounded-0 border-0 py-3"
                  type="button"
                  id="button-minus"
                  aria-label="decrease-quantity"
                  onClick={() => {
                    setCartQuantity((pre) => (pre === 1 ? 1 : pre - 1));
                  }}
                >
                  <i className="bi bi-dash"></i>
                </button>
              </div>
              <input
                type="number"
                className="form-control border-0 text-center my-auto shadow-none"
                placeholder=""
                aria-label="cartQuantity"
                readOnly
                value={cartQuantity}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-dark rounded-0 border-0 py-3"
                  type="button"
                  id="button-plus"
                  aria-label="increase-quantity"
                  onClick={() => {
                    setCartQuantity((pre) => (pre === 20 ? 20 : pre + 1));
                  }}
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-dark w-100 rounded-0 py-3"
              onClick={() => addToCart()}
              disabled={isDataUpdata}
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductsDetail;
