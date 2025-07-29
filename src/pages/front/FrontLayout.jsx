import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";
import MessageToast from "../../components/MessageToast";
import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../../redux/slice/messageSlice";

function FrontLayout() {
  const apiPath = process.env.REACT_APP_APT_PATH;
  const [allProducts, setAllProducts] = useState([]); //產品資料
  const [cartData, setCartData] = useState({}); //購物車資料
  const [orderData, setOrderData] = useState({}); //訂單資料
  const [isLoading, setIsLoading] = useState(false); //Loading狀態管理
  const [delayed, setDelayed] = useState(false); //首頁促銷卡片Delayed狀態管理
  const dispatch = useDispatch();

  const getProducts = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/v2/api/${apiPath}/products/all`);
      console.log("產品列表", res);
      setAllProducts(res.data.products);
    } catch (error) {
      console.error(error);
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      setIsLoading(false);
      setDelayed(true);
    }
  };

  const getCart = async () => {
    try {
      const res = await axios.get(`/v2/api/${apiPath}/cart`);
      console.log("購物車內容", res);
      setCartData(res.data.data);
    } catch (error) {
      console.log(error);
      dispatch(createAsyncMessage(error.response.data));
    }
  };

  const getOrder = async (orderIdData) => {
    console.log("orderIdData:", orderIdData);
    setIsLoading(true);
    try {
      const res = await axios.get(
        `/v2/api/${apiPath}/order/${orderIdData.orderId}`
      );
      console.log(res);
      if (orderIdData.source === "success") {
        setCartData({ carts: [], final_total: 0, total: 0 });
      }
      // const productsArray = Object.entries(res.data.order.products).map(
      //   ([id, data]) => ({ ...data })
      // );
      // const mergeData = {
      //   ...res,
      //   data: { ...res.data, order: { ...res.data.order, productsArray } },
      // };
      // console.log("New訂單內容", mergeData);
      setOrderData(res.data);
      // setOrderData(mergeData.data);
    } catch (error) {
      console.log(error);
      dispatch(createAsyncMessage(error.response.data));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
    getCart();
  }, []);

  return (
    <>
      <Navbar cartData={cartData} allProducts={allProducts} />
      <MessageToast />
      <div className=" min-vh-100">
        <Outlet
          context={{
            getCart,
            setCartData,
            cartData,
            allProducts,
            getOrder,
            orderData,
            setOrderData,
            isLoading,
            setIsLoading,
            delayed,
          }}
        ></Outlet>
      </div>

      <Footer />
    </>
  );
}

export default FrontLayout;
