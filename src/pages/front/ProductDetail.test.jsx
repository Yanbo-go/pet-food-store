import { render, screen, waitFor } from "@testing-library/react";
import {
  MemoryRouter,
  Routes,
  Route,
  useOutletContext,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../../slice/messageSlice";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import ProductDetail from "./ProductDetail";

jest.mock("../../components/Loading", () => () => <div>Loading...</div>);

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useOutletContext: jest.fn(),
}));
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));
jest.mock("../../slice/messageSlice", () => ({
  ...jest.requireActual("../../slice/messageSlice"),
  createAsyncMessage: jest.fn(),
}));

describe("ProductDetail 整合測試", () => {
  const getCart = jest.fn().mockImplementation(() => {
    mockContext.cartData = [
      ...carts,
      {
        coupon: {
          code: "new1010",
          due_date: 1723075200000,
          id: "-O1XSyMv8jgiv3cqgC-B",
          is_enabled: 1,
          num: 1,
          percent: 80,
          title: "新會員",
        },
        final_total: 1760,
        id: "-OMuAS8tuIosJE3zMa86",
        product: {
          category: "飼料",
          content: "混合六種新鮮魚類製作而成",
          description: "",
          id: "-O1N-NF8VTeRlALZY0tH",
          imageUrl:
            "https://maoup.com.tw/wp-content/uploads/2020/07/%E3%80%90%E6%B8%B4%E6%9C%9B-Orijen%E3%80%91%E5%85%AD%E7%A8%AE%E9%AE%AE%E9%AD%9A%E7%84%A1%E7%A9%80%E8%B2%93%E7%B3%A7.jpg",
          is_enabled: 1,
          num: 5,
          origin_price: 650,
          price: 550,
          title: "貓貓六種魚飼料",
          unit: "1",
        },
        product_id: "-O1N-NF8VTeRlALZY0tH",
        qty: 4,
        total: 2200,
      },
    ];
    return Promise.resolve();
  });

  const mockDispatch = jest.fn(); // 模擬 dispatch  函式
  const mockThunk = jest.fn(); // 模擬 thunk 函式

  const cartData = [
    {
      coupon: {
        code: "new1010",
        due_date: 1723075200000,
        id: "-O1XSyMv8jgiv3cqgC-B",
        is_enabled: 1,
        num: 1,
        percent: 80,
        title: "新會員",
      },
      final_total: 720,
      id: "-OMmltY9yHWAp-xMTNFb",
      product: {
        category: "零食",
        content: "貓狗適用零食",
        description: "成分:雞胸肉",
        id: "-O2roPKZwQ-dkJzqn8G8",
        imageUrl:
          "https://images.unsplash.com/photo-1627662306400-d0af4b1e14e5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fGNoaWNrZW4lMjBqZXJseXxlbnwwfHwwfHx8MA%3D%3D",
        is_enabled: 1,
        origin_price: 400,
        price: 300,
        title: "原味雞肉乾",
        unit: "NA",
      },
      product_id: "test-id",
      qty: 18,
      total: 900,
    },
    {
      coupon: {
        code: "new1010",
        due_date: 1723075200000,
        id: "-O1XSyMv8jgiv3cqgC-B",
        is_enabled: 1,
        num: 1,
        percent: 80,
        title: "新會員",
      },
      final_total: 1080,
      id: "-OMuAQ6FpXxGZgDkclQ1",
      product: {
        category: "零食",
        content: "擺脫狗狗口臭和牙周病!!",
        description: "",
        id: "-O1N-Ujn77GNklnEJHYJ",
        imageUrl:
          "https://images.unsplash.com/photo-1592468257342-8375cb556a69?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        is_enabled: 1,
        num: 3,
        origin_price: 380,
        price: 450,
        title: "狗狗潔牙神器",
        unit: "NA",
      },
      product_id: "-O1N-Ujn77GNklnEJHYJ",
      qty: 3,
      total: 1350,
    },
  ];

  const mockContext = {
    getCart: getCart,
    cartData: {
      carts: cartData,
      final_total: 6666,
      total: 7000,
    },
    isLoading: false,
    setIsLoading: jest.fn(),
  };

  const renderProductDetail = () => {
    return render(
      <MemoryRouter initialEntries={["/products/test-id"]}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useOutletContext.mockReturnValue(mockContext);
    axios.get.mockImplementation((url) => {
      const productId = url.split("/product/")[1];

      if (productId === "test-id") {
        return Promise.resolve({
          data: {
            success: true,
            product: {
              category: "衣服3",
              content: "這是內容",
              description: "Sit down please 名設計師設計",
              id: "test-id",
              imageUrl: "主圖網址",
              imagesUrl: [
                "圖片網址一",
                "圖片網址二",
                "圖片網址三",
                "圖片網址四",
                "圖片網址五",
              ],
              is_enabled: 1,
              num: 1,
              origin_price: 100,
              price: 600,
              title: "[賣]動物園造型衣服3",
              unit: "個",
            },
          },
        });
      }

      return Promise.resolve({ data: {} });
    });

    useDispatch.mockReturnValue(mockDispatch); // 模擬 useDispatch 返回 dispatch 函式
    createAsyncMessage.mockReturnValue(mockThunk); //模擬 createAsyncMessage 返回的 thunk 函式
  });

  test("取得產品資訊並正確顯示在畫面", async () => {
    renderProductDetail();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/product/test-id")
    );

    await waitFor(() => {
      expect(screen.getByText("[賣]動物園造型衣服3")).toBeInTheDocument();
      expect(screen.getByText("這是內容")).toBeInTheDocument();
      expect(screen.getByText("NT$600")).toBeInTheDocument();
    });
  });

  test("點擊數量 + 與 - 按鈕可以正確更新畫面", async () => {
    renderProductDetail();

    expect(screen.getByLabelText("cartQuantity")).toHaveValue(1);
    const plusBtn = screen.getByRole("button", { name: "increase-quantity" });
    const minusBtn = screen.getByRole("button", {
      name: "decrease-quantity",
    });

    userEvent.click(plusBtn);
    userEvent.click(plusBtn);
    userEvent.click(minusBtn);

    await waitFor(() => {
      expect(screen.getByLabelText("cartQuantity")).toHaveValue(2);
    });
  });

  test("點擊加入購物車可以成功呼叫API後 dispatch成功訊息 並呼叫getCart", async () => {
    const mockAddtoCart = axios.post.mockResolvedValue({
      data: { success: true, message: "已加入購物車" },
    });

    renderProductDetail();

    userEvent.click(screen.getByText("加入購物車"));

    await waitFor(() => {
      expect(mockAddtoCart).toHaveBeenCalled();
      expect(createAsyncMessage).toHaveBeenCalledWith({
        success: true,
        message: "已加入購物車",
      });
      expect(mockContext.getCart).toHaveBeenCalled();
    });
  });

  test("點擊加入購物車後如果 購物車數量大於20 dispatch錯誤訊息", async () => {
    renderProductDetail();

    const plusBtn = screen.getByRole("button", { name: "increase-quantity" });
    userEvent.click(plusBtn);
    userEvent.click(plusBtn);
    userEvent.click(screen.getByText("加入購物車"));

    await waitFor(() => {
      expect(createAsyncMessage).toHaveBeenCalledWith({
        message: `訂購數量已達上限，可訂數量=2`,
      });
      expect(mockContext.getCart).not.toHaveBeenCalled();
    });
  });

  test("取得產品API 失敗時dispatch錯誤訊息", async () => {
    axios.get.mockRejectedValueOnce({
      response: { data: { success: false, message: "取得產品資料失敗" } },
    });

    renderProductDetail();

    await waitFor(() => {
      expect(createAsyncMessage).toHaveBeenCalledWith({
        success: false,
        message: "取得產品資料失敗",
      });
    });
  });

  test("加入購物車API 失敗時dispatch錯誤訊息", async () => {
    const mockAddtoCart = axios.post.mockRejectedValueOnce({
      response: { data: { success: false, message: "加入購物車失敗" } },
    });

    renderProductDetail();

    userEvent.click(await screen.findByText("加入購物車"));

    await waitFor(() => {
      expect(mockAddtoCart).toHaveBeenCalled();
      expect(createAsyncMessage).toHaveBeenCalledWith({
        success: false,
        message: "加入購物車失敗",
      });
    });
  });
});
