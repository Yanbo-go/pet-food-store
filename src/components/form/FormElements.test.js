import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckboxRadio, Input, Select } from "./FormElements";
import { useForm } from "react-hook-form";
import { useState } from "react";

const onSubmiteMock = jest.fn();

describe("FormElements單元測試", () => {
  describe("CheckboxRadio單元測試", () => {
    const RenderCheckboxRadio = () => {
      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        mode: "onTouched",
      });

      const [payment, setPayment] = useState("");

      return (
        <form onSubmit={handleSubmit(onSubmiteMock)}>
          {errors["gridRadios"] && (
            <div className="invalid-feedback">
              {errors["gridRadios"]?.message}
            </div>
          )}
          <CheckboxRadio
            id="card"
            type="radio"
            labelText="信用卡"
            register={register}
            errors={errors}
            rules={{
              required: "請選擇付款方式",
            }}
            value={"信用卡"}
            name={"gridRadios"}
            setPayment={setPayment}
            payment={payment}
          >
            <p>Child Test</p>
          </CheckboxRadio>
          <button type="submit">送出</button>
        </form>
      );
    };

    const RenderCheckboxRadiobyApplyPay = () => {
      return (
        <CheckboxRadio
          id="card"
          type="radio"
          labelText="ApplyPay"
          register={() => {}}
          errors={{}}
          rules={{}}
          value={"ApplyPay"}
          name={"gridRadios"}
          setPayment={() => {}}
          payment={{}}
        ></CheckboxRadio>
      );
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("選擇信用卡 成功呼叫setPayment 並顯示child內容", async () => {
      render(<RenderCheckboxRadio />);

      const radio = screen.getByRole("radio", { name: "信用卡" });
      await userEvent.click(radio);
      expect(radio).toBeChecked();
      expect(screen.getByText("Child Test")).toBeInTheDocument();
    });

    test("選擇ApplyPay 成功呼叫setPayment 不顯示child內容", async () => {
      render(<RenderCheckboxRadiobyApplyPay />);
      const radio = screen.getByRole("radio", { name: "ApplyPay" });
      await userEvent.click(radio);
      expect(radio).toBeChecked();
      expect(screen.queryByText("Child Test")).not.toBeInTheDocument();
    });

    test("未選擇付款方式送出 顯示錯誤訊息", async () => {
      render(<RenderCheckboxRadio />);
      const radio = screen.getByRole("radio", { name: "信用卡" });
      const submit = screen.getByRole("button", { name: "送出" });
      await userEvent.click(submit);

      expect(radio).toHaveClass("is-invalid");
      expect(screen.getByText("請選擇付款方式")).toBeInTheDocument();
    });
  });

  describe("Input單元測試", () => {
    const RenderInput = () => {
      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        mode: "onTouched",
      });

      return (
        <form onSubmit={handleSubmit(onSubmiteMock)}>
          <Input
            id="tel"
            labelText="電話"
            type="tel"
            errors={errors}
            register={register}
            rules={{
              required: "電話為必填",
              minLength: {
                value: 6,
                message: "電話不少於 6 碼",
              },
              maxLength: {
                value: 12,
                message: "電話不超過 12 碼",
              },
            }}
          />
          <button type="submit">送出</button>
        </form>
      );
    };

    beforeEach(() => {
      jest.clearAllMocks();
      render(<RenderInput />);
    });

    test("輸入少於6碼 顯示錯誤訊息 ", async () => {
      const telInput = screen.getByRole("textbox", { name: "電話" });
      await userEvent.type(telInput, "0955");
      fireEvent.blur(telInput);

      await waitFor(() => {
        expect(screen.getByText("電話不少於 6 碼")).toBeInTheDocument();
      });
    });

    test("輸入超過12碼 顯示錯誤訊息 ", async () => {
      const telInput = screen.getByRole("textbox", { name: "電話" });
      await userEvent.type(telInput, "09555555555555");
      fireEvent.blur(telInput);

      await waitFor(() => {
        expect(screen.getByText("電話不超過 12 碼")).toBeInTheDocument();
      });
    });

    test("未輸入電話送出 顯示錯誤訊息", async () => {
      const telInput = screen.getByRole("textbox", { name: "電話" });
      const submit = screen.getByRole("button", { name: "送出" });
      await userEvent.click(submit);

      expect(telInput).toHaveClass("is-invalid");
      expect(screen.getByText("電話為必填")).toBeInTheDocument();
    });
  });

  describe("Select單元測試", () => {
    const RenderSelect = () => {
      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({
        mode: "onTouched",
      });

      return (
        <form onSubmit={handleSubmit(onSubmiteMock)}>
          <Select
            id="shippingCountry"
            errors={errors}
            register={register}
            rules={{
              required: "請選擇國家/地區",
            }}
            dataTestId="selectCountry"
          >
            <option value="">國家/地區</option>
            <option>...</option>
          </Select>
          <button type="submit">送出</button>
        </form>
      );
    };

    beforeEach(() => {
      jest.clearAllMocks();
      render(<RenderSelect />);
    });

    test("未選擇國家/地區送出 顯示錯誤訊息", async () => {
      const select = screen.getByTestId("selectCountry");
      const input = screen.getByRole("button", { name: "送出" });
      await userEvent.click(input);

      expect(select).toHaveClass("is-invalid");
      expect(screen.getByText("請選擇國家/地區")).toBeInTheDocument();
    });
  });

  //   const couponDataMock = {
  //     success: true,
  //     message: "有效",
  //   };

  //   const RenderCouponInput = () => {
  //     const [couponCode, setCouponCode] = useState("testCode");

  //     return (
  //       <CouponInput
  //         id="coupon"
  //         type="text"
  //         labelText=""
  //         couponCode={couponCode}
  //         setCouponCode={setCouponCode}
  //         checkCoupon={handleCheckCouponMock}
  //         clearCoupon={handleClearCouponMock}
  //         couponData={couponDataMock}
  //       />
  //     );
  //   };

  //   render(<RenderCouponInput />);

  //   const cancelBtn = screen.getByRole("button", { name: "取消折扣碼" });
  //   await userEvent.click(cancelBtn);

  //   expect(handleClearCouponMock).toHaveBeenCalled();
  // });
});
