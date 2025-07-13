import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import CardInput from "./CardInput";

const luhnCheckMock = jest.fn(() => true);
const handleCardNumberChangeMock = jest.fn();
const onSubmiteMock = jest.fn();

describe("CardInput單元測試", () => {
  const RenderCardInput = () => {
    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm({
      mode: "onTouched",
    });

    return (
      <form onSubmit={handleSubmit(onSubmiteMock)}>
        <CardInput
          id="cardNumber"
          type="text"
          maxLength="19"
          errors={errors}
          register={register}
          rules={{
            required: "請輸入信用卡號",
            pattern: {
              value: /^[0-9\s]{13,19}$/,
              message: "請輸入有效的信用卡號（13~19 位數）",
            },
          }}
          placeholder="**** **** **** ****"
          handleChange={handleCardNumberChangeMock}
          format={false}
          luhnCheck={luhnCheckMock}
        />
        <button type="submit">送出</button>
      </form>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("輸入信用卡號成功呼叫OnChange", async () => {
    render(<RenderCardInput />);

    const input = screen.getByPlaceholderText("**** **** **** ****");
    await userEvent.type(input, "1234");

    expect(handleCardNumberChangeMock).toHaveBeenCalledWith(
      expect.any(Object),
      "cardNumber",
      false
    );
  });

  test("非完整信用卡號 顯示錯誤訊息", async () => {
    render(<RenderCardInput />);

    const input = screen.getByPlaceholderText("**** **** **** ****");
    await userEvent.type(input, "1234");
    fireEvent.blur(input);

    await waitFor(() => {
      expect(
        screen.getByText("請輸入有效的信用卡號（13~19 位數）")
      ).toBeInTheDocument();
    });
  });

  test("未輸入信用卡號送出 顯示錯誤訊息", async () => {
    render(<RenderCardInput />);

    const onSubmit = screen.getByText("送出");
    await userEvent.click(onSubmit);

    expect(screen.getByText("請輸入信用卡號")).toBeInTheDocument();
  });

  test("輸入信用卡號 呼叫luhnCheck驗證成功", async () => {
    render(<RenderCardInput />);

    const input = screen.getByPlaceholderText("**** **** **** ****");
    const onSubmit = screen.getByText("送出");

    await userEvent.type(input, "1234567890123456");
    await userEvent.click(onSubmit);

    expect(luhnCheckMock).toHaveBeenCalledWith("1234567890123456");
  });

  test("輸入信用卡號 呼叫luhnCheck驗證失敗", async () => {
    luhnCheckMock.mockReturnValueOnce(false);

    render(<RenderCardInput />);

    const input = screen.getByPlaceholderText("**** **** **** ****");
    const onSubmit = screen.getByText("送出");

    await userEvent.type(input, "1234567890123456");
    await userEvent.click(onSubmit);

    expect(luhnCheckMock).toHaveBeenCalledWith("1234567890123456");
    expect(screen.getByText("無效的信用卡")).toBeInTheDocument;
  });
});
