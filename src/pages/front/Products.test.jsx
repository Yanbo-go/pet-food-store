import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
import Products from "./Products";

jest.mock("../../components/Loading", () => () => <div>Loading...</div>);
jest.mock("../../components/Pagination", () => () => <div>Pagination...</div>);

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useOutletContext: jest.fn(),
}));
jest.mock("../../slice/messageSlice", () => ({
  ...jest.requireActual("../../slice/messageSlice"),
  createAsyncMessage: jest.fn(),
}));
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

describe("Products 整合測試", () => {
  const allProducts = [
    { id: 0, context: "貓飼料" },
    { id: 2, context: "狗飼料" },
    { id: 3, context: "貓罐頭" },
  ];

  const mockContext = {
    allProducts: allProducts,
    isLoading: false,
    setIsLoading: jest.fn(),
  };

  const mockDispatch = jest.fn(); //模擬 dispatch 函式
  const mockThunk = jest.fn(); // 模擬 thunk 函式

  const renderProducts = (url = "p=1") => {
    return render(
      <MemoryRouter initialEntries={[`/products?${url}`]}>
        <Routes>
          <Route path="/products" element={<Products />} />
        </Routes>
      </MemoryRouter>
    );
  };

  const getProductTitles = () =>
    screen.getAllByTestId("product-title").map((el) => el.textContent);

  beforeEach(() => {
    jest.clearAllMocks();

    useOutletContext.mockReturnValue(mockContext);

    useDispatch.mockReturnValue(mockDispatch); //模擬 useDispatch 返回的 mockDispatch 函式
    createAsyncMessage.mockReturnValue(mockThunk); //模擬 createAsyncMessage 返回的 thunk 函式

    axios.get.mockImplementation((url) => {
      if (url.includes("category=飼料")) {
        return Promise.resolve({
          data: {
            success: true,
            products: [
              {
                category: "飼料",
                content: "這是內容",
                description: "這是某個飼料",
                id: "test-id1",
                imageUrl: "主圖網址",
                is_enabled: 1,
                num: 1,
                origin_price: 500,
                price: 300,
                title: "狗飼料",
                unit: "NA",
              },
            ],
            pagination: {
              total_pages: 1,
              current_page: 1,
              has_pre: false,
              has_next: false,
              category: "",
            },
          },
        });
      }

      if (url.includes("category=零食")) {
        return Promise.resolve({
          data: {
            success: true,
            products: [
              {
                category: "零食",
                content: "這是內容",
                description: "這是某個零食",
                id: "test-id2",
                imageUrl: "主圖網址",
                is_enabled: 1,
                num: 1,
                origin_price: 400,
                price: 200,
                title: "貓零食",
                unit: "NA",
              },
            ],
            pagination: {
              total_pages: 1,
              current_page: 1,
              has_pre: false,
              has_next: false,
              category: "",
            },
          },
        });
      }

      if (url.includes("/products")) {
        return Promise.resolve({
          data: {
            success: true,
            products: [
              {
                category: "飼料",
                content: "這是內容",
                description: "這是某個飼料",
                id: "test-id1",
                imageUrl: "主圖網址",
                is_enabled: 1,
                num: 1,
                origin_price: 500,
                price: 300,
                title: "狗飼料",
                unit: "NA",
              },
              {
                category: "零食",
                content: "這是內容",
                description: "這是某個零食",
                id: "test-id2",
                imageUrl: "主圖網址",
                is_enabled: 1,
                num: 1,
                origin_price: 400,
                price: 200,
                title: "貓零食",
                unit: "NA",
              },
            ],
            pagination: {
              total_pages: 1,
              current_page: 1,
              has_pre: false,
              has_next: false,
              category: "",
            },
          },
        });
      }

      return Promise.resolve({ data: {} });
    });
  });

  test("取得全部產品資訊並正確顯示在畫面", async () => {
    renderProducts();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    //測試麵包屑
    expect(
      screen.getByRole("navigation", { name: "breadcrumb" })
    ).toBeInTheDocument();
    expect(screen.getByText("全部產品")).toBeInTheDocument();
    //測試搜尋欄
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    //測試排列項目
    expect(
      screen.getByRole("button", { name: "預設排序" })
    ).toBeInTheDocument();
    //測試API取得
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/products")
    );

    await waitFor(() => {
      expect(screen.getByText("狗飼料")).toBeInTheDocument();
      expect(screen.getByText("貓零食")).toBeInTheDocument();
      expect(screen.getByText("Pagination...")).toBeInTheDocument();
      expect(
        screen.getByText("顯示第 1 至 2 項結果，共 2 項")
      ).toBeInTheDocument();
    });
  });

  test("取得飼料產品資訊並正確顯示在畫面", async () => {
    renderProducts("page=1&category=飼料");

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    //測試麵包屑
    expect(
      screen.getByRole("navigation", { name: "breadcrumb" })
    ).toBeInTheDocument();
    expect(screen.getByText("飼料")).toBeInTheDocument();
    //測試搜尋欄
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    //測試排列項目
    expect(
      screen.getByRole("button", { name: "預設排序" })
    ).toBeInTheDocument();
    //測試API取得
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("category=飼料")
    );

    await waitFor(() => {
      expect(screen.getByText("狗飼料")).toBeInTheDocument();
      expect(screen.getByText("Pagination...")).toBeInTheDocument();
      expect(
        screen.getByText("顯示第 1 至 1 項結果，共 1 項")
      ).toBeInTheDocument();
    });
  });

  test("取得零食產品資訊並正確顯示在畫面", async () => {
    renderProducts("page=1&category=零食");

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    //測試麵包屑
    expect(
      screen.getByRole("navigation", { name: "breadcrumb" })
    ).toBeInTheDocument();
    expect(screen.getByText("零食")).toBeInTheDocument();
    //測試搜尋欄
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    //測試排列項目
    expect(
      screen.getByRole("button", { name: "預設排序" })
    ).toBeInTheDocument();
    //測試API取得
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("category=零食")
    );

    await waitFor(() => {
      expect(screen.getByText("貓零食")).toBeInTheDocument();
      expect(screen.getByText("Pagination...")).toBeInTheDocument();
      expect(
        screen.getByText("顯示第 1 至 1 項結果，共 1 項")
      ).toBeInTheDocument();
    });
  });

  test("搜尋關鍵字產品", async () => {
    renderProducts("");

    const searchInput = screen.getByPlaceholderText("Search...");
    expect(searchInput).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("貓零食")).toBeInTheDocument();
      expect(screen.getByText("狗飼料")).toBeInTheDocument();
    });

    await userEvent.type(searchInput, "貓");

    await waitFor(
      () => {
        expect(searchInput).toHaveValue("貓");
        expect(getProductTitles()).toEqual(["貓零食"]);
      },
      { timeout: 1100 }
    );
  });

  test("排序點選 價格：低→高 會更新排序", async () => {
    renderProducts();

    const toggleButton = screen.getByRole("button", { name: "預設排序" });
    expect(toggleButton).toBeInTheDocument();

    await waitFor(() => {
      expect(getProductTitles()).toEqual(["狗飼料", "貓零食"]);
    });

    const lowtoHigh = screen.getByRole("button", { name: "升序" });
    userEvent.click(lowtoHigh);
    expect(lowtoHigh).toBeInTheDocument();

    await waitFor(() => {
      expect(getProductTitles()).toEqual(["貓零食", "狗飼料"]);
    });
  });

  test("排序點選 價格：高→低 會更新排序", async () => {
    renderProducts();

    const toggleButton = screen.getByRole("button", { name: "預設排序" });
    expect(toggleButton).toBeInTheDocument();

    await waitFor(() => {
      expect(getProductTitles()).toEqual(["狗飼料", "貓零食"]);
    });

    const lowtoHigh = screen.getByRole("button", { name: "升序" });
    userEvent.click(lowtoHigh);

    await waitFor(() => {
      expect(getProductTitles()).toEqual(["貓零食", "狗飼料"]);
    });

    const hightoLow = screen.getByRole("button", { name: "降序" });
    userEvent.click(hightoLow);

    await waitFor(() => {
      expect(getProductTitles()).toEqual(["狗飼料", "貓零食"]);
    });
  });

  test("產品取得API 失敗時dispatch錯誤訊息", async () => {
    axios.get.mockRejectedValueOnce({
      response: { data: { success: false, message: "產品取得失敗" } },
    });

    renderProducts();

    await waitFor(() => {
      expect(createAsyncMessage).toHaveBeenCalledWith({
        success: false,
        message: "產品取得失敗",
      });
    });
  });

  test("類別產品取得API 失敗時dispatch錯誤訊息", async () => {
    axios.get.mockRejectedValueOnce({
      response: { data: { success: false, message: "飼料產品取得失敗" } },
    });

    renderProducts("page=1&category=飼料");

    await waitFor(() => {
      expect(createAsyncMessage).toHaveBeenCalledWith({
        success: false,
        message: "飼料產品取得失敗",
      });
    });
  });
});

describe("Products/search 整合測試", () => {
  const allProducts = [
    { id: 0, title: "貓零食" },
    { id: 2, title: "狗飼料" },
    { id: 3, title: "貓罐頭" },
  ];

  const mockContext = {
    allProducts: allProducts,
    isLoading: false,
    setIsLoading: jest.fn(),
  };

  const mockDispatch = jest.fn(); //模擬 dispatch 函式
  const mockThunk = jest.fn(); // 模擬 thunk 函式

  const renderProducts = (url, p = "1") => {
    return render(
      <MemoryRouter initialEntries={[`/products/search?result=${url}&p=${p}`]}>
        <Routes>
          <Route path="/products/search" element={<Products />} />
        </Routes>
      </MemoryRouter>
    );
  };

  const getProductTitles = () =>
    screen.getAllByTestId("product-title").map((el) => el.textContent);

  const observers = new Set();

  class IntersectionObserverMock {
    constructor(callback) {
      this.callback = callback;
      observers.add(this);
    }
    observe() {}
    unobserve() {}
    disconnect() {}

    static triggerIntersect(entries) {
      for (const observer of observers) {
        observer.callback(entries);
      }
    }

    static clear() {
      observers.clear();
    }
  }

  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    useOutletContext.mockReturnValue(mockContext);

    useDispatch.mockReturnValue(mockDispatch); //模擬 useDispatch 返回的 mockDispatch 函式
    createAsyncMessage.mockReturnValue(mockThunk); //模擬 createAsyncMessage 返回的 thunk 函式

    axios.get.mockImplementation((url) => {
      if (url.includes("/products/all")) {
        return Promise.resolve({
          data: {
            success: true,
            products: [
              {
                category: "飼料",
                content: "這是內容",
                description: "這是某個飼料",
                id: "test-id1",
                imageUrl: "主圖網址",
                is_enabled: 1,
                num: 1,
                origin_price: 500,
                price: 300,
                title: "狗飼料",
                unit: "NA",
              },
              {
                category: "零食",
                content: "這是內容",
                description: "這是某個零食",
                id: "test-id2",
                imageUrl: "主圖網址",
                is_enabled: 1,
                num: 1,
                origin_price: 400,
                price: 200,
                title: "貓零食",
                unit: "NA",
              },
              {
                category: "飼料",
                content: "這是內容",
                description: "這是某個飼料",
                id: "test-id3",
                imageUrl: "主圖網址",
                is_enabled: 1,
                num: 1,
                origin_price: 700,
                price: 400,
                title: "貓罐頭",
                unit: "NA",
              },
              {
                category: "零食",
                content: "這是內容",
                description: "這是某個零食",
                id: "test-id4",
                imageUrl: "主圖網址",
                is_enabled: 1,
                num: 1,
                origin_price: 400,
                price: 210,
                title: "零食2",
                unit: "NA",
              },
              {
                category: "零食",
                content: "這是內容",
                description: "這是某個零食",
                id: "test-id5",
                imageUrl: "主圖網址",
                is_enabled: 1,
                num: 1,
                origin_price: 400,
                price: 220,
                title: "零食3",
                unit: "NA",
              },
              {
                category: "零食",
                content: "這是內容",
                description: "這是某個零食",
                id: "test-id6",
                imageUrl: "主圖網址",
                is_enabled: 1,
                num: 1,
                origin_price: 400,
                price: 230,
                title: "零食4",
                unit: "NA",
              },
              {
                category: "零食",
                content: "這是內容",
                description: "這是某個零食",
                id: "test-id7",
                imageUrl: "主圖網址",
                is_enabled: 1,
                num: 1,
                origin_price: 400,
                price: 240,
                title: "零食5",
                unit: "NA",
              },
              {
                category: "零食",
                content: "這是內容",
                description: "這是某個零食",
                id: "test-id8",
                imageUrl: "主圖網址",
                is_enabled: 1,
                num: 1,
                origin_price: 400,
                price: 250,
                title: "零食6",
                unit: "NA",
              },
              {
                category: "零食",
                content: "這是內容",
                description: "這是某個零食",
                id: "test-id9",
                imageUrl: "主圖網址",
                is_enabled: 1,
                num: 1,
                origin_price: 400,
                price: 270,
                title: "零食7",
                unit: "NA",
              },
              {
                category: "零食",
                content: "這是內容",
                description: "這是某個零食",
                id: "test-id10",
                imageUrl: "主圖網址",
                is_enabled: 1,
                num: 1,
                origin_price: 400,
                price: 100,
                title: "零食8",
                unit: "NA",
              },
              {
                category: "零食",
                content: "這是內容",
                description: "這是某個零食",
                id: "test-id11",
                imageUrl: "主圖網址",
                is_enabled: 1,
                num: 1,
                origin_price: 400,
                price: 50,
                title: "零食9",
                unit: "NA",
              },
            ],
            pagination: {
              total_pages: 1,
              current_page: 1,
              has_pre: false,
              has_next: false,
              category: "",
            },
          },
        });
      }

      return Promise.resolve({ data: {} });
    });
  });

  test("取得全部產品資訊並正確顯示在畫面", async () => {
    renderProducts("貓");

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    //測試麵包屑
    expect(
      screen.getByRole("navigation", { name: "breadcrumb" })
    ).toBeInTheDocument();
    expect(screen.getByText("全部產品")).toBeInTheDocument();
    expect(screen.getByText('搜尋"貓"的結果')).toBeInTheDocument();

    //測試搜尋欄
    expect(screen.getByPlaceholderText("搜尋產品...")).toBeInTheDocument();
    //測試排列項目
    expect(
      screen.getByRole("button", { name: "預設排序" })
    ).toBeInTheDocument();
    //測試API取得
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/products/all")
    );

    await waitFor(() => {
      expect(screen.getByText("貓零食")).toBeInTheDocument();
      expect(screen.getByText("貓罐頭")).toBeInTheDocument();
      expect(
        screen.getByText("顯示第 1 至 2 項結果，共 2 項")
      ).toBeInTheDocument();
    });

    renderProducts("狗");

    await waitFor(() => {
      expect(screen.getByText("狗飼料")).toBeInTheDocument();
      expect(
        screen.getByText("顯示第 1 至 1 項結果，共 1 項")
      ).toBeInTheDocument();
    });
  });

  test("排序點選 價格：高→低 低→高 並成功更新排序", async () => {
    renderProducts("貓");

    const toggleButton = screen.getByRole("button", { name: "預設排序" });
    expect(toggleButton).toBeInTheDocument();

    await waitFor(() => {
      expect(getProductTitles()).toEqual(["貓零食", "貓罐頭"]);
    });

    const hightoLow = screen.getByRole("button", { name: "降序" });
    userEvent.click(hightoLow);
    expect(hightoLow).toBeInTheDocument();

    await waitFor(() => {
      expect(getProductTitles()).toEqual(["貓罐頭", "貓零食"]);
    });

    const lowtoHigh = screen.getByRole("button", { name: "升序" });
    userEvent.click(lowtoHigh);
    expect(lowtoHigh).toBeInTheDocument();

    await waitFor(() => {
      expect(getProductTitles()).toEqual(["貓零食", "貓罐頭"]);
    });
  });

  test("搜尋產品狗 且延遲1秒顯示建議值 並成功更新畫面", async () => {
    renderProducts("貓");

    await waitFor(() => {
      expect(screen.getByText("貓零食")).toBeInTheDocument();
      expect(screen.getByText("貓罐頭")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("搜尋產品...");
    const searchBtn = screen.getByRole("button", { name: "搜尋" });

    await userEvent.type(searchInput, "狗");

    await waitFor(
      () => {
        expect(
          screen.getByRole("button", { name: "狗飼料" })
        ).toBeInTheDocument();
      },
      { timeout: 1100 }
    );

    await userEvent.click(screen.getByRole("button", { name: "狗飼料" }));

    await userEvent.click(searchBtn);

    expect(screen.getByText("狗飼料")).toBeInTheDocument();
    expect(
      screen.getByText("顯示第 1 至 1 項結果，共 1 項")
    ).toBeInTheDocument();
  });

  test("產品超過8個並下拉到底時 執行lazy Loading", async () => {
    renderProducts("零食");

    await waitFor(() => {
      expect(screen.getByText("貓零食")).toBeInTheDocument();
    });

    const targetElement = screen.getByTestId("fixedLastProduct");

    fireEvent.scroll(window, { target: { scrollY: 1000 } });

    await waitFor(async () => {
      window.IntersectionObserver.triggerIntersect([
        {
          isIntersecting: true,
          target: targetElement,
        },
      ]);
    });

    await waitFor(() => {
      expect(screen.getByText("零食9")).toBeInTheDocument();
    });
  });

  test("全域產品搜尋取得API 失敗時dispatch錯誤訊息", async () => {
    axios.get.mockRejectedValueOnce({
      response: { data: { success: false, message: "'貓'產品取得失敗" } },
    });

    renderProducts("貓");

    await waitFor(() => {
      expect(createAsyncMessage).toHaveBeenCalledWith({
        success: false,
        message: "'貓'產品取得失敗",
      });
    });
  });
});
