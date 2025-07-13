import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useState } from "react";
import { MemoryRouter, Routes, Route, Outlet } from "react-router-dom";
import Ordercheck from "./OrderCheck";

describe("OrderCheck 整合測試", () => {
  const mockGetOrder = jest.fn();
  const mockSetOrderData = jest.fn();

  const MockOutletContextProvider = () => {
    const [orderData, setOrderData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const mockOrderData = {
      data: {
        success: true,
        order: {
          id: "order123",
          is_paid: true,
          total: 3000,
          user: { name: "王小明" },
          products: [
            {
              qty: 2,
              total: 2000,
              final_total: 1800,
              product: { title: "貓罐頭" },
            },
            {
              qty: 1,
              total: 1000,
              final_total: 900,
              product: { title: "狗骨頭" },
            },
          ],
        },
      },
    };

    mockGetOrder.mockImplementation(() => {
      setOrderData(mockOrderData.data);
    });

    mockSetOrderData.mockImplementation((data) => {
      setOrderData(data);
    });

    return (
      <Outlet
        context={{
          getOrder: mockGetOrder,
          orderData: orderData,
          setOrderData: mockSetOrderData,
          isLoading: isLoading,
        }}
      />
    );
  };

  const renderOrdercheckWithContext = () => {
    return render(
      <MemoryRouter initialEntries={["/ordercheck"]}>
        <Routes>
          <Route path="/" element={<MockOutletContextProvider />}>
            <Route path="ordercheck" element={<Ordercheck />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  test("輸入訂單後能查詢並顯示正確的訂單資料", async () => {
    renderOrdercheckWithContext();

    const input = screen.getByPlaceholderText("搜尋訂單...");
    const button = screen.getByRole("button", { name: "搜尋" });

    fireEvent.change(input, { target: { value: "ORDER123" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockGetOrder).toHaveBeenCalled();
      expect(mockSetOrderData).not.toHaveBeenCalled();
    });

    await waitFor(() => {
      // 確認畫面正確顯示訂單內容
      expect(screen.getByText("訂單號碼:")).toBeInTheDocument();
      expect(screen.getByText("order123")).toBeInTheDocument();
      expect(screen.getByText("已付款")).toBeInTheDocument();
      expect(screen.getByText("王小明")).toBeInTheDocument();
      expect(screen.getByText("NT$3,000")).toBeInTheDocument();
      expect(screen.getByText("貓罐頭")).toBeInTheDocument();
      expect(screen.getByText("NT$1,800")).toBeInTheDocument();
      expect(screen.getByText("狗骨頭")).toBeInTheDocument();
      expect(screen.getByText("NT$900")).toBeInTheDocument();
    });
  });
});
