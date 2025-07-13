import { render, screen } from "@testing-library/react";
import { ProductSearchBar, ProductKeywordSearch } from "./SearchBar";
import { MemoryRouter, useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../../hooks/useDebounce", () => ({
  __esModule: true,
  default: (fn) => fn,
}));

describe("SearchBar單元測試", () => {
  describe("ProductSearchBar", () => {
    const mockAllProducts = [
      { id: 0, title: "貓零食" },
      { id: 2, title: "狗飼料" },
      { id: 3, title: "貓罐頭" },
    ];

    const renderProductSearchBar = (isPage = true) => {
      return render(
        <MemoryRouter>
          <ProductSearchBar allProducts={mockAllProducts} isPage={isPage} />
        </MemoryRouter>
      );
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });
    test("輸入搜尋文字後顯示正確建議", async () => {
      renderProductSearchBar();

      const input = screen.getByPlaceholderText("搜尋產品...");
      await userEvent.type(input, "貓");

      expect(screen.getByText("貓零食")).toBeInTheDocument();
      expect(screen.getByText("貓罐頭")).toBeInTheDocument();
      expect(screen.queryByText("狗飼料")).not.toBeInTheDocument();
    });

    test("點擊建議項目自動填入Input", async () => {
      renderProductSearchBar();

      const input = screen.getByPlaceholderText("搜尋產品...");
      await userEvent.type(input, "貓");
      const suggestionClick = screen.getByText("貓零食");
      await userEvent.click(suggestionClick);

      expect(input).toHaveValue("貓零食");
    });

    test("空值送出搜尋顯示錯誤訊息", async () => {
      renderProductSearchBar();

      const search = screen.getByText("搜尋");
      await userEvent.click(search);

      expect(screen.getByText("請輸入搜尋內容")).toBeInTheDocument();
    });

    test("搜尋產品狗成功呼叫useNavigate", async () => {
      const mockNavigate = jest.fn();
      useNavigate.mockReturnValue(mockNavigate);

      renderProductSearchBar();

      const input = screen.getByPlaceholderText("搜尋產品...");
      const search = screen.getByText("搜尋");

      await userEvent.type(input, "狗");

      await userEvent.click(search);

      expect(mockNavigate).toHaveBeenCalledWith(
        "/products/search?result=狗&p=1"
      );
    });

    test("頁面視窗寬小於850時不改變搜尋框", async () => {
      window.innerWidth = 849;
      window.dispatchEvent(new Event("resize"));

      renderProductSearchBar();

      expect(
        screen.queryByRole("button", { name: "mobileSearch" })
      ).not.toBeInTheDocument();
      expect(screen.getByPlaceholderText("搜尋產品...")).toBeInTheDocument();
    });

    test("非頁面視窗寬小於850時變更為搜尋圖示", async () => {
      window.innerWidth = 849;
      window.dispatchEvent(new Event("resize"));

      renderProductSearchBar(false);

      expect(screen.getByRole("button", { name: "mobileSearch" })).toHaveClass(
        "search-icon"
      );
      expect(
        screen.queryByPlaceholderText("搜尋產品...")
      ).not.toBeInTheDocument();
    });

    test("非頁面視窗寬小於850時 點擊搜尋圖示下方顯示搜尋框 點擊外部關閉搜尋框", async () => {
      window.innerWidth = 849;
      window.dispatchEvent(new Event("resize"));

      renderProductSearchBar(false);

      const seacrIcon = screen.getByRole("button", { name: "mobileSearch" });

      await userEvent.click(seacrIcon);

      expect(screen.getByPlaceholderText("搜尋產品...")).toBeInTheDocument();

      await userEvent.click(document.body);

      expect(
        screen.queryByPlaceholderText("搜尋產品...")
      ).not.toBeInTheDocument();
    });

    test("非頁面視窗寬大於850時變更為搜尋框", async () => {
      window.innerWidth = 851;
      window.dispatchEvent(new Event("resize"));

      renderProductSearchBar(false);

      expect(
        screen.queryByRole("button", { name: "mobileSearch" })
      ).not.toBeInTheDocument();
      expect(screen.getByPlaceholderText("搜尋產品...")).toBeInTheDocument();
    });
  });

  describe("ProductKeywordSearch", () => {
    const mockSetProducts = jest.fn();
    const mockSetOriginalProducts = jest.fn();

    const mockProducts = [
      { id: 0, title: "貓零食" },
      { id: 2, title: "狗飼料" },
      { id: 3, title: "貓罐頭" },
    ];

    const renderProductKeywordSearch = () => {
      return render(
        <MemoryRouter>
          <ProductKeywordSearch
            products={mockProducts}
            pageCategory={() => {}}
            pageValue={() => {}}
            setProducts={mockSetProducts}
            setOriginalProducts={mockSetOriginalProducts}
          />
        </MemoryRouter>
      );
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });
    test("輸入搜尋文字後正確過濾產品", async () => {
      renderProductKeywordSearch();

      const input = screen.getByPlaceholderText("Search...");
      await userEvent.type(input, "貓");

      expect(mockSetProducts).toHaveBeenCalledWith([
        { id: 0, title: "貓零食" },
        { id: 3, title: "貓罐頭" },
      ]);
      expect(mockSetOriginalProducts).toHaveBeenCalledWith([
        { id: 0, title: "貓零食" },
        { id: 3, title: "貓罐頭" },
      ]);
    });
  });
});
