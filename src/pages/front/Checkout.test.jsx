import { render, screen, waitFor } from "@testing-library/react";
import { useSelector, useDispatch } from "react-redux";
import { createAsyncMessage } from "../../slice/messageSlice";
import {
  MemoryRouter,
  Routes,
  Route,
  useOutletContext,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import Checkout from "./Checkout";
import Success from "./Success";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useOutletContext: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock("../../slice/messageSlice", () => ({
  ...jest.requireActual("../../slice/messageSlice"),
  createAsyncMessage: jest.fn(),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock("axios");

describe("formatCardNumber 單元測試", () => {
  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  test("格式化 16 碼卡號", () => {
    expect(formatCardNumber("1234567812345678")).toBe("1234 5678 1234 5678");
  });

  test("移除非數字並正確格式化", () => {
    expect(formatCardNumber("1234-5678-1234-5678")).toBe("1234 5678 1234 5678");
  });

  test("處理不足 16 碼的卡號", () => {
    expect(formatCardNumber("1234567")).toBe("1234 567");
  });

  test("處理空字串", () => {
    expect(formatCardNumber("")).toBe("");
  });

  test("處理卡號包含空格和字母", () => {
    expect(formatCardNumber("1234 abcd 5678")).toBe("1234 5678");
  });

  test("格式化結果不會有多餘空格", () => {
    expect(formatCardNumber("1234 5678 ")).toBe("1234 5678");
  });
});

describe("formatExpiryDate 單元測試", () => {
  const formatExpiryDate = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{0,2})/, (_, mm, yy) => (yy ? `${mm}/${yy}` : mm));
  };

  test("格式化為 MM/YY", () => {
    expect(formatExpiryDate("1225")).toBe("12/25");
  });

  test("移除非數字", () => {
    expect(formatExpiryDate("12?25")).toBe("12/25");
    expect(formatExpiryDate("ab12cd25")).toBe("12/25");
  });
});

describe("formatCvvNumber 單元測試", () => {
  const formatCvvNumber = (value) => {
    return value.replace(/\D/g, "").substring(0, 4);
  };

  test("最多4位數字", () => {
    expect(formatCvvNumber("123")).toBe("123");
    expect(formatCvvNumber("1234")).toBe("1234");
    expect(formatCvvNumber("12345")).toBe("1234");
  });

  test("移除非數字", () => {
    expect(formatCvvNumber("1a2b3")).toBe("123");
    expect(formatCvvNumber("1 2-3*4")).toBe("1234");
  });

  test("空輸入回傳空字串", () => {
    expect(formatCvvNumber("")).toBe("");
  });
});

describe("Form Validation 單元測試", () => {
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

  const mockContext = {
    cartData: mockCartData,
  };

  const renderCheckout = () => {
    return render(
      <MemoryRouter initialEntries={["/Checkout"]}>
        <Routes>
          <Route path="/Checkout" element={<Checkout />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    useOutletContext.mockReturnValue(mockContext);
    useSelector.mockReturnValue({
      code: "",
      discountedTotal: null,
      message: "",
      success: false,
    });
  });

  test("未輸入資料送出 跳出錯誤", async () => {
    renderCheckout();

    const checkoutBtn = screen.getByRole("button", { name: "送出訂單" });
    await userEvent.click(checkoutBtn);

    expect(screen.getByText("Email 為必填"));
    expect(screen.getByText("姓名為必填"));
    expect(screen.getByText("電話為必填"));
    expect(screen.getByText("地址為必填"));
    expect(screen.getByText("請選擇國家/地區"));
    expect(screen.getByText("請填寫配送地址"));
    expect(screen.getByText("請選擇付款方式"));
  });

  test("輸入錯誤資料會顯示錯誤 輸入正確格式錯誤消失", async () => {
    renderCheckout();

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    await userEvent.type(emailInput, "test");

    const nameInput = screen.getByRole("textbox", { name: "姓名" });
    await userEvent.type(nameInput, "test");

    const telInput = screen.getByRole("textbox", { name: "電話" });
    await userEvent.type(telInput, "0955");

    const addressInput = screen.getByRole("textbox", { name: "地址" });
    await userEvent.type(addressInput, "新竹");

    const cardInput = screen.getByRole("radio", { name: "信用卡" });
    await userEvent.click(cardInput);

    const cardNumberInput = screen.getByPlaceholderText("**** **** **** ****");
    await userEvent.type(cardNumberInput, "1111111111111111");

    expect(screen.getByText("Email 格式不正確")).toBeInTheDocument();
    expect(screen.getByText("電話不少於 6 碼")).toBeInTheDocument();
    expect(screen.getByText("無效的信用卡")).toBeInTheDocument();
  });

  test("輸入正確格式 不顯示錯誤", async () => {
    renderCheckout();

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    await userEvent.type(emailInput, "test@gmail.com");

    const telInput = screen.getByRole("textbox", { name: "電話" });
    await userEvent.type(telInput, "0965124883");

    const cardInput = screen.getByRole("radio", { name: "信用卡" });
    await userEvent.click(cardInput);

    const cardNumberInput = screen.getByPlaceholderText("**** **** **** ****");
    await userEvent.type(cardNumberInput, "5555555555554444");

    expect(screen.queryByText("Email 格式不正確")).not.toBeInTheDocument();
    expect(screen.queryByText("電話不少於 6 碼")).not.toBeInTheDocument();
    expect(screen.queryByText("無效的信用卡")).not.toBeInTheDocument();
  });
});

describe("Checkout 整合測試", () => {
  const mockCartData = {
    carts: [
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
    ],
    total: 6000,
  };

  const mockContext = {
    cartData: mockCartData,
  };

  const navigate = jest.fn();
  const mockDispatch = jest.fn(); //模擬 dispatch 函式
  const mockThunk = jest.fn(); // 模擬 thunk 函式

  const renderCheckout = () => {
    return render(
      <MemoryRouter initialEntries={["/Checkout"]}>
        <Routes>
          <Route path="/Checkout" element={<Checkout />} />
          <Route path="/Success:orderId" element={<Success />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useOutletContext.mockReturnValue(mockContext);
    useNavigate.mockReturnValue(navigate);
    useDispatch.mockReturnValue(mockDispatch); //模擬 useDispatch 返回的 mockDispatch 函式
    createAsyncMessage.mockReturnValue(mockThunk); //模擬 createAsyncMessage 返回的 thunk 函式
    useSelector.mockReturnValue({
      code: "new1010",
      discountedTotal: 4500,
      message: "已套用優惠券:testCode",
      success: true,
    });
  });

  test("cartData正確顯示 輸入正確資料並送出API 成功跳轉頁面", async () => {
    renderCheckout();

    axios.post.mockResolvedValue({
      data: {
        success: true,
        message: "已建立訂單",
        total: 4500,
        create_at: 1523539519,
        orderId: "yyyadas313",
      },
    });
    expect(screen.getByText("原味雞肉乾"));

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    await userEvent.type(emailInput, "test@gmail.com");

    const nameInput = screen.getByRole("textbox", { name: "姓名" });
    await userEvent.type(nameInput, "test01");

    const telInput = screen.getByRole("textbox", { name: "電話" });
    await userEvent.type(telInput, "0955455884");

    const addressInput = screen.getByRole("textbox", { name: "地址" });
    await userEvent.type(addressInput, "新竹市");

    const select = screen.getByTestId("selectCountry");
    await userEvent.selectOptions(select, "...");

    const select2 = screen.getByTestId("selectCity");
    await userEvent.selectOptions(select2, "...");

    const addressInput2 = screen.getByPlaceholderText("地址");
    await userEvent.type(addressInput2, "testaddress");

    const cardInput = screen.getByRole("radio", { name: "信用卡" });
    await userEvent.click(cardInput);

    const cardNumberInput = screen.getByPlaceholderText("**** **** **** ****");
    await userEvent.type(cardNumberInput, "5555555555554444");

    const cardExpiryInput = screen.getByPlaceholderText("MM/YY");
    await userEvent.type(cardExpiryInput, "0533");

    const cardSecurityCodeInput = screen.getByPlaceholderText("CVV");
    await userEvent.type(cardSecurityCodeInput, "357");

    await waitFor(() => {
      expect(screen.getByText("折扣碼")).toBeInTheDocument();
      expect(screen.getByText("new1010")).toBeInTheDocument();
    });

    const checkoutBtn = screen.getByRole("button", { name: "送出訂單" });
    await userEvent.click(checkoutBtn);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/success/yyyadas313");
    });
  });

  test("API 失敗時dispatch錯誤訊息", async () => {
    renderCheckout();

    axios.post.mockRejectedValueOnce({
      response: { data: { success: false, message: "訂單送出失敗" } },
    });

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    await userEvent.type(emailInput, "test@gmail.com");

    const nameInput = screen.getByRole("textbox", { name: "姓名" });
    await userEvent.type(nameInput, "test01");

    const telInput = screen.getByRole("textbox", { name: "電話" });
    await userEvent.type(telInput, "0955455884");

    const addressInput = screen.getByRole("textbox", { name: "地址" });
    await userEvent.type(addressInput, "新竹市");

    const select = screen.getByTestId("selectCountry");
    await userEvent.selectOptions(select, "...");

    const select2 = screen.getByTestId("selectCity");
    await userEvent.selectOptions(select2, "...");

    const addressInput2 = screen.getByPlaceholderText("地址");
    await userEvent.type(addressInput2, "testaddress");

    const cardInput = screen.getByRole("radio", { name: "信用卡" });
    await userEvent.click(cardInput);

    const cardNumberInput = screen.getByPlaceholderText("**** **** **** ****");
    await userEvent.type(cardNumberInput, "5555555555554444");

    const cardExpiryInput = screen.getByPlaceholderText("MM/YY");
    await userEvent.type(cardExpiryInput, "0533");

    const cardSecurityCodeInput = screen.getByPlaceholderText("CVV");
    await userEvent.type(cardSecurityCodeInput, "357");

    const checkoutBtn = screen.getByRole("button", { name: "送出訂單" });
    await userEvent.click(checkoutBtn);

    await waitFor(() => {
      expect(createAsyncMessage).toHaveBeenCalledWith({
        success: false,
        message: "訂單送出失敗",
      });
    });
  });
});
