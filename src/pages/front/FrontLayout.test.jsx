import { render, screen, waitFor } from "@testing-library/react";
import {
  Routes,
  Route,
  useOutletContext,
  MemoryRouter,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../../slice/messageSlice";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import FrontLayout from "./FrontLayout";

//mock子元件

jest.mock("../../components/Navbar", () => () => (
  <div data-testid="navbar">Navbar測試</div>
));
jest.mock("../../components/MessageToast", () => () => (
  <div data-testid="toast">MessageToast</div>
));
jest.mock("../../components/Footer", () => () => (
  <div data-testid="footer">Footer</div>
));
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));
jest.mock("../../slice/messageSlice", () => ({
  ...jest.requireActual("../../slice/messageSlice"),
  createAsyncMessage: jest.fn(),
}));

jest.mock("axios");

describe("FrontLayout整合測試", () => {
  const mockDispatch = jest.fn(); // 模擬 dispatch  函式
  const mockThunk = jest.fn(); // 模擬 thunk 函式

  function MockChild() {
    const { cartData, allProducts, orderData, isLoading, getOrder, delayed } =
      useOutletContext();
    return (
      <div>
        <div>子元件測試</div>
        <div>Loading: {isLoading.toString()}</div>
        <div>delayed: {delayed.toString()}</div>
        <div>購物車數量: {cartData.carts?.length}</div>
        <div>產品數量: {allProducts.length}</div>
        <button
          onClick={() => getOrder({ orderId: "test", source: "orderCheck" })}
        >
          取得訂單觸發
        </button>
        <div>訂單數量: {orderData.order?.products?.length}</div>
      </div>
    );
  }

  const renderFrontLayout = () => {
    return render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<FrontLayout />}>
            <Route index element={<MockChild />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    axios.get.mockImplementation((url) => {
      if (url.includes("/products/all")) {
        return Promise.resolve({
          data: { products: [{ id: 0, context: "貓飼料" }] },
        });
      }

      if (url.includes("/cart")) {
        return Promise.resolve({
          data: {
            data: {
              carts: [
                { id: 0, context: "貓飼料" },
                { id: 1, context: "狗飼料" },
              ],
              final_total: 1000,
            },
          },
        });
      }

      if (url.includes("/order")) {
        return Promise.resolve({
          data: {
            order: {
              products: [
                { id: 0, context: "訂單1" },
                { id: 1, context: "訂單2" },
                { id: 2, context: "訂單3" },
              ],
            },
          },
        });
      }

      return Promise.resolve({ data: {} });
    });
    useDispatch.mockReturnValue(mockDispatch); // 模擬 useDispatch 返回 dispatch 函式
    createAsyncMessage.mockReturnValue(mockThunk); //模擬 createAsyncMessage 返回的 thunk 函式
  });

  test("應正常渲染 Narbar、Footer和子頁面內容並取得API內容", async () => {
    renderFrontLayout();

    expect(screen.queryByText("Loading: true")).toBeInTheDocument();
    userEvent.click(screen.getByText("取得訂單觸發"));

    // 1. 等待 API 呼叫完成
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/products/all")
      );
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/cart"));
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("/order"));

      // 2. 測試 Navbar、MessageToast、Footer 是否渲染
      expect(screen.getByText(/Navbar/i)).toBeInTheDocument();
      expect(screen.getByText(/MessageToast/i)).toBeInTheDocument();
      expect(screen.getByText(/Footer/i)).toBeInTheDocument();

      // 3. 測試子頁面渲染
      expect(screen.getByText("子元件測試")).toBeInTheDocument();

      // 4. 測試 context 傳遞的 isLoading 狀態、產品資料
      expect(screen.getByText("訂單數量: 3")).toBeInTheDocument();
      expect(screen.getByText("Loading: false")).toBeInTheDocument();
      expect(screen.getByText("delayed: true")).toBeInTheDocument();
      expect(screen.getByText("產品數量: 1")).toBeInTheDocument();
    });
  });

  test("產品.購物車取得API 失敗時dispatch錯誤訊息", async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes("/products/all")) {
        return Promise.reject({
          response: { data: { success: false, message: "產品取得失敗" } },
        });
      }

      if (url.includes("/cart")) {
        return Promise.reject({
          response: { data: { success: false, message: "購物車取得失敗" } },
        });
      }
    });

    renderFrontLayout();

    await waitFor(() => {
      expect(createAsyncMessage).toHaveBeenCalledWith({
        success: false,
        message: "產品取得失敗",
      });

      expect(createAsyncMessage).toHaveBeenCalledWith({
        success: false,
        message: "購物車取得失敗",
      });
    });
  });

  test("訂單取得API 失敗時dispatch錯誤訊息", async () => {
    axios.get.mockRejectedValueOnce({
      response: { data: { success: false, message: "訂單取得失敗" } },
    });

    renderFrontLayout();

    userEvent.click(screen.getByText("取得訂單觸發"));

    await waitFor(() => {
      expect(createAsyncMessage).toHaveBeenCalledWith({
        success: false,
        message: "訂單取得失敗",
      });
    });
  });
});
