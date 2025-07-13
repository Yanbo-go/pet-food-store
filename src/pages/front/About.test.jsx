import { render, screen, waitFor } from "@testing-library/react";
import {
  MemoryRouter,
  Route,
  Routes,
  useOutletContext,
} from "react-router-dom";
import userEvent from "@testing-library/user-event";
import About from "./About";

jest.mock("../../components/Loading", () => () => <div>Loading...</div>); // 模擬 Loading 元件

// Mock react-router-dom 的 useOutletContext
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useOutletContext: jest.fn(),
}));

describe("About Page 單元測試", () => {
  const mockContext = {
    isLoading: false,
    delayed: true,
  };

  const renderAbout = () => {
    return render(
      <MemoryRouter initialEntries={["/about"]}>
        <Routes>
          <Route path="about" element={<About />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useOutletContext.mockReturnValue(mockContext);
  });

  test("所有元件正常顯示，且按鈕可以正常切換內容", async () => {
    renderAbout();

    // 檢查 PromotionalCard 是否顯示
    expect(screen.getByTestId("Story-card")).toBeInTheDocument();
    expect(screen.getByTestId("Team-card")).toBeInTheDocument();
    expect(screen.getByTestId("Quality-card")).toBeInTheDocument();
    // 檢查 Loading 是否顯示
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // 檢查 Head 元件是否渲染
    expect(screen.getByAltText(/aboutImg/i)).toBeInTheDocument();

    // 檢查 PromotionalCard 是否顯示按鈕
    userEvent.click(screen.getByRole("button", { name: /Story/i }));
    await waitFor(() => {
      // 按下「Story」後，檢查相關內容是否顯示
      expect(screen.getByText(/讓每個毛孩都能擁有最好的/i)).toBeInTheDocument();
      expect(screen.getByText(/品牌理念/i)).toBeInTheDocument();
    });

    // 按下「Team」，檢查相關內容是否顯示
    userEvent.click(screen.getByRole("button", { name: /Team/i }));
    await waitFor(() => {
      expect(screen.getByText(/用心，為毛孩打造美好生活/i)).toBeInTheDocument();
      expect(screen.getByText(/團隊理念/i)).toBeInTheDocument();
    });

    // 按下「Quality」，檢查相關內容是否顯示
    userEvent.click(screen.getByRole("button", { name: /Quality/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/嚴選品質，給毛孩最好的保障/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/品質保證/i)).toBeInTheDocument();
    });
  });
});
