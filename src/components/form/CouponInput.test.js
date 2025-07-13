import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CouponInput from "./CouponInput";
import { useState } from "react";

jest.mock("../../hooks/useDebounce", () => ({
  __esModule: true,
  default: (fn) => {
    return fn;
  },
}));

const handleCheckCouponMock = jest.fn();
const handleClearCouponMock = jest.fn();

describe("CouponInput單元測試", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("輸入折扣碼 成功呼叫OnChange", async () => {
    const couponDataMock = {
      success: false,
      message: "無效",
    };

    const RenderCouponInput = () => {
      const [couponCode, setCouponCode] = useState("");

      return (
        <CouponInput
          id="coupon"
          type="text"
          labelText=""
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          checkCoupon={handleCheckCouponMock}
          clearCoupon={handleClearCouponMock}
          couponData={couponDataMock}
        />
      );
    };

    render(<RenderCouponInput />);

    const input = screen.getByRole("textbox", { name: "輸入折扣碼" });
    await userEvent.type(input, "testCode");

    expect(input).toHaveValue("testCode");
    expect(handleCheckCouponMock).toHaveBeenCalledWith("testCode");
  });

  test("輸入有效折扣碼 成功取得couponData", async () => {
    const couponDataMock = {
      success: true,
      message: "有效",
    };

    const RenderCouponInput = () => {
      const [couponCode, setCouponCode] = useState("testCode");

      return (
        <CouponInput
          id="coupon"
          type="text"
          labelText=""
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          checkCoupon={handleCheckCouponMock}
          clearCoupon={handleClearCouponMock}
          couponData={couponDataMock}
        />
      );
    };

    render(<RenderCouponInput />);

    const input = screen.getByRole("textbox", { name: "輸入折扣碼" });

    expect(input).toHaveValue("testCode");
    expect(screen.getByText("取消折扣碼")).toBeInTheDocument();
  });

  test("取消有效折扣碼 成功呼叫clearCoupon", async () => {
    const couponDataMock = {
      success: true,
      message: "有效",
    };

    const RenderCouponInput = () => {
      const [couponCode, setCouponCode] = useState("testCode");

      return (
        <CouponInput
          id="coupon"
          type="text"
          labelText=""
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          checkCoupon={handleCheckCouponMock}
          clearCoupon={handleClearCouponMock}
          couponData={couponDataMock}
        />
      );
    };

    render(<RenderCouponInput />);

    const cancelBtn = screen.getByRole("button", { name: "取消折扣碼" });
    await userEvent.click(cancelBtn);

    expect(handleClearCouponMock).toHaveBeenCalled();
  });
});
