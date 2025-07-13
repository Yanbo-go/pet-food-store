import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useState, React } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MemoryRouter, Routes, Route, Outlet } from "react-router-dom";
import { createAsyncMessage } from "../../slice/messageSlice";
import { applyCoupon, clearCoupon } from "../../slice/couponSlice";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import Cart from "./Cart";

// mock 子元件與函式
jest.mock("../../components/Navbar", () => () => (
  <div data-testid="navbar">Navbar測試</div>
));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock("../../slice/messageSlice", () => ({
  ...jest.requireActual("../../slice/messageSlice"),
  createAsyncMessage: jest.fn(),
}));
jest.mock("../../slice/couponSlice", () => ({
  ...jest.requireActual("../../slice/couponSlice"),
  applyCoupon: jest.fn(),
  clearCoupon: jest.fn(),
}));
jest.mock("axios");

describe("Cart 整合測試", () => {
  const mockCartData = [
    {
      id: "cart-1",
      final_total: 720,
      product: {
        id: "prod-1",
        title: "原味雞肉乾",
        content: "雞胸肉",
      },
      qty: 1,
    },
    {
      id: "cart-2",
      final_total: 1080,
      product: {
        id: "prod-2",
        title: "狗狗潔牙神器",
        content: "除口臭",
      },
      qty: 2,
    },
  ];

  const mockSetCartData = jest.fn();
  const mockDispatch = jest.fn();
  const mockThunk = jest.fn();
  const mockApplyCouponThunk = jest.fn();
  const mockClearCouponThunk = jest.fn();

  const MockOutletContextProvider = () => {
    const [cartData, setCartData] = useState({
      carts: mockCartData,
      final_total: 6666,
      total: 7000,
    });

    mockSetCartData.mockImplementation((newData) => {
      setCartData(newData);
    });

    return <Outlet context={{ cartData, setCartData: mockSetCartData }} />;
  };

  const renderCartWithContext = () => {
    return render(
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/" element={<MockOutletContextProvider />}>
            <Route path="/cart" element={<Cart />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useDispatch.mockReturnValue(mockDispatch);
    createAsyncMessage.mockReturnValue(mockThunk);
    applyCoupon.mockReturnValue(mockApplyCouponThunk);
    clearCoupon.mockReturnValue(mockClearCouponThunk);
    useSelector.mockReturnValue({
      code: "",
      discountedTotal: null,
      message: "",
      success: false,
    });
  });

  test("購物車資料正確讀取", () => {
    renderCartWithContext();

    expect(screen.getByText("原味雞肉乾")).toBeInTheDocument();
    expect(screen.getByText("狗狗潔牙神器")).toBeInTheDocument();
  });

  test("刪除商品後畫面正常更新", async () => {
    renderCartWithContext();

    axios.delete.mockResolvedValue({
      data: { success: true, message: "已刪除" },
    });

    const deleteButton = screen.getByRole("button", { name: "刪除商品1" });
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalled();
      expect(mockSetCartData).toHaveBeenCalled();
      expect(createAsyncMessage).toHaveBeenCalledWith({
        success: true,
        message: "已刪除",
      });
    });

    await waitFor(() => {
      expect(screen.queryByText("原味雞肉乾")).not.toBeInTheDocument();
      expect(screen.getByText("狗狗潔牙神器")).toBeInTheDocument();
    });
  });

  test("刪除全部商品後畫面正常更新", async () => {
    renderCartWithContext();

    axios.delete.mockResolvedValue({
      data: { success: true, message: "已刪除" },
    });

    const delAllBtn = screen.getByRole("button", { name: "刪除全部商品" });
    expect(screen.getByText("前往結帳")).toBeInTheDocument();
    await userEvent.click(delAllBtn);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalled();
      expect(createAsyncMessage).toHaveBeenCalledWith({
        success: true,
        message: "已刪除",
      });
    });

    await waitFor(() => {
      expect(screen.queryByText("原味雞肉乾")).not.toBeInTheDocument();
      expect(screen.queryByText("狗狗潔牙神器")).not.toBeInTheDocument();
      expect(screen.queryByText("前往結帳")).not.toBeInTheDocument();
      expect(screen.getByText("還沒有選擇產品喔!!!")).toBeInTheDocument();
    });
  });

  test("更新商品數量後畫面正常更新", async () => {
    axios.put.mockResolvedValue({
      data: { success: true, message: "數量更新成功" },
    });

    renderCartWithContext();

    expect(screen.getByText("1")).toBeInTheDocument();
    const qtyBtn = screen.getAllByRole("combobox");
    fireEvent.focus(qtyBtn[0]);
    fireEvent.keyDown(qtyBtn[0], { key: "ArrowDown" });

    const options = screen.getAllByText("2");
    await userEvent.click(options[0]);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
      expect(createAsyncMessage).toHaveBeenCalledWith({
        success: true,
        message: "數量更新成功",
      });
    });

    await waitFor(() => {
      expect(screen.queryByText("原味雞肉乾")).toBeInTheDocument();
      expect(screen.getAllByText("2")[0]).toBeInTheDocument();
    });
  });

  test("折價卷輸入成功並成功顯示折價", async () => {
    useSelector
      .mockReturnValueOnce({
        code: "",
        discountedTotal: 0,
        message: "",
        success: false,
      })
      .mockReturnValueOnce({
        code: "testCode",
        discountedTotal: 500,
        message: "已套用優惠券:testCode",
        success: true,
      });

    renderCartWithContext();

    const couponIntput = screen.getByRole("textbox", { name: "輸入折扣碼" });
    expect(screen.getByText("折扣碼:")).toBeInTheDocument();
    await userEvent.type(couponIntput, "testCode");

    await waitFor(
      () => {
        expect(applyCoupon).toHaveBeenCalledWith("t");
      },
      { timeout: 1000 }
    );

    await waitFor(() => {
      expect(screen.getByText("NT$500")).toBeInTheDocument();
      expect(screen.getByText("取消折扣碼")).toBeInTheDocument();
    });
  });

  test("折價卷輸入成功後取消折扣碼", async () => {
    useSelector
      .mockReturnValueOnce({
        code: "",
        discountedTotal: 0,
        message: "",
        success: false,
      })
      .mockReturnValueOnce({
        code: "testCode",
        discountedTotal: 500,
        message: "已套用優惠券:testCode",
        success: true,
      })
      .mockReturnValueOnce({
        code: "",
        discountedTotal: 0,
        message: "",
        success: false,
      });

    renderCartWithContext();

    const couponIntput = screen.getByRole("textbox", { name: "輸入折扣碼" });
    expect(screen.getByText("折扣碼:")).toBeInTheDocument();
    await userEvent.type(couponIntput, "testCode");

    const couponCancelBtn = screen.getByRole("button", { name: "取消折扣碼" });
    await userEvent.click(couponCancelBtn);

    await waitFor(() => {
      expect(clearCoupon).toHaveBeenCalledWith("折扣碼已移除");
    });

    await waitFor(() => {
      expect(screen.getByText("NT$7000")).toBeInTheDocument();
      expect(screen.queryByText("取消折扣碼")).not.toBeInTheDocument();
    });
  });

  test("刪除商品API 失敗時dispatch錯誤訊息", async () => {
    axios.delete.mockRejectedValueOnce({
      response: { data: { success: false, message: "刪除商品失敗" } },
    });

    renderCartWithContext();

    const deleteButton = screen.getByRole("button", { name: "刪除商品1" });
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(createAsyncMessage).toHaveBeenCalledWith({
        success: false,
        message: "刪除商品失敗",
      });
    });
  });

  test("刪除全部商品API 失敗時dispatch錯誤訊息", async () => {
    axios.delete.mockRejectedValueOnce({
      response: { data: { success: false, message: "刪除全部商品失敗" } },
    });

    renderCartWithContext();

    const delAllBtn = screen.getByRole("button", { name: "刪除全部商品" });
    await userEvent.click(delAllBtn);

    await waitFor(() => {
      expect(createAsyncMessage).toHaveBeenCalledWith({
        success: false,
        message: "刪除全部商品失敗",
      });
    });
  });

  test("更新商品數量API 失敗時dispatch錯誤訊息", async () => {
    axios.put.mockRejectedValueOnce({
      response: { data: { success: false, message: "更新商品數量失敗" } },
    });

    renderCartWithContext();

    const qtyBtn = screen.getAllByRole("combobox");
    fireEvent.focus(qtyBtn[0]);
    fireEvent.keyDown(qtyBtn[0], { key: "ArrowDown" });

    const options = screen.getAllByText("2");
    await userEvent.click(options[0]);

    await waitFor(() => {
      expect(createAsyncMessage).toHaveBeenCalledWith({
        success: false,
        message: "更新商品數量失敗",
      });
    });
  });
});
