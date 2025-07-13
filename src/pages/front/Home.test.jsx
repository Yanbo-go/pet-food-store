import { render, screen, waitFor } from "@testing-library/react";
import {
  MemoryRouter,
  Route,
  Routes,
  useOutletContext,
  useNavigate,
} from "react-router-dom";
import Home from "./Home";
import userEvent from "@testing-library/user-event";

jest.mock("../../components/Loading", () => () => <div>Loading...</div>); // 模擬 Loading 元件

// Mock react-router-dom 的 useOutletContext
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useOutletContext: jest.fn(),
  useNavigate: jest.fn(),
}));

describe("HomePage整合測試", () => {
  const mockContext = {
    allProducts: [
      { id: "p1", title: "貓罐頭", price: 100, content: "test1" },
      { id: "p2", title: "狗飼料", price: 120, content: "test2" },
    ],
    isLoading: false,
    delayed: true,
  };

  const renderHome = () => {
    return render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );
  };

  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useOutletContext.mockReturnValue(mockContext);
    useNavigate.mockReturnValue(mockNavigate);
  });

  test("全部元件正常顯示", () => {
    renderHome();

    // 檢查 Loading 是否顯示
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // 檢查 Head 元件是否渲染
    expect(screen.getByAltText(/homeImg/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "搜尋" })).toBeInTheDocument();

    // 檢查 PromotionalCard 是否顯示
    expect(screen.getByTestId("highQulity-card")).toBeInTheDocument();
    expect(screen.getByTestId("fastShip-card")).toBeInTheDocument();
    expect(screen.getByTestId("cashBack-card")).toBeInTheDocument();

    // 檢查 FeaturedProducts 是否顯示
    expect(screen.getByText("貓罐頭")).toBeInTheDocument();
    expect(screen.getByText("狗飼料")).toBeInTheDocument();

    // 檢查 ReviewCard 是否顯示
    expect(screen.getByText("評論區")).toBeInTheDocument();
    expect(screen.getByText("貓貓鮪魚飼料")).toBeInTheDocument();
    expect(screen.getByText("狗狗潔牙神器")).toBeInTheDocument();
    expect(screen.getByText("狗狗健康飼料")).toBeInTheDocument();
    expect(screen.getByText("客服服務超棒，值得推薦!")).toBeInTheDocument();
  });

  test("關鍵字搜尋跳轉成功", async () => {
    renderHome();

    const searchBtn = screen.getByRole("button", { name: "搜尋" });
    const searchInput = screen.getByRole("textbox", { name: "搜尋產品" });

    //輸入字串
    await userEvent.type(searchInput, "貓");

    await waitFor(
      () => {
        expect(
          screen.getByRole("button", { name: "貓罐頭" })
        ).toBeInTheDocument();
      },
      { timeout: 1100 }
    );

    //點擊搜尋
    await userEvent.click(searchBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/products/search?result=貓&p=1");
  });
});
