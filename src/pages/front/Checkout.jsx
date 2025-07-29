import { useState, memo } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createAsyncMessage } from "../../redux/slice/messageSlice";
import axios from "axios";
import {
  Input,
  CheckboxRadio,
  Select,
} from "../../components/form/FormElements";
import { useForm } from "react-hook-form";
import CardInput from "../../components/form/CardInput";

function Checkout() {
  const apiPath = process.env.REACT_APP_APT_PATH;
  const { cartData } = useOutletContext();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });
  const couponData = useSelector((state) => state.coupon);
  const dispatch = useDispatch();
  const [payment, setPayment] = useState("");

  const handleCardNumberChange = (e, id, foramt) => {
    const formattedValue = foramt(e.target.value);
    setValue(id, formattedValue, { shouldValidate: true });
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "") // 移除非數字
      .replace(/(.{4})/g, "$1 ") // 每 4 個數字後加空格
      .trim(); // 移除尾部空格
  };

  const formatExpiryDate = (value) => {
    return value
      .replace(/\D/g, "") // 移除非數字
      .replace(/(\d{2})(\d{0,2})/, (_, mm, yy) => (yy ? `${mm}/${yy}` : mm)); // 格式化 MM/YY
  };

  const formatCvvNumber = (value) => {
    return value.replace(/\D/g, "").substring(0, 4); // 移除非數字
  };

  const luhnCheck = (value) => {
    const cardNumber = value.replace(/\s/g, "");

    if (!/^\d+$/.test(cardNumber)) return false;

    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const onSubmit = async (data) => {
    const { name, email, tel, address } = data;
    const form = {
      data: {
        user: {
          name,
          email,
          tel,
          address,
        },
      },
    };
    try {
      const orderRes = await axios.post(`/v2/api/${apiPath}/order`, form);
      const { success, orderId } = orderRes.data;

      if (!success) {
        dispatch(createAsyncMessage(orderRes.data));
        return;
      }

      //模擬訂單建立付款成功
      const payRes = await axios.post(`/v2/api/${apiPath}/pay/${orderId}`);

      if (!payRes.data.success) {
        dispatch(createAsyncMessage(payRes.data));
        return;
      }

      navigate(`/success/${orderId}`);
    } catch (error) {
      dispatch(createAsyncMessage(error.response?.data));
    }
  };

  return (
    <div className="container-fluid bg-light pt-5 pb-5">
      <div className="row  justify-content-center flex-md-row">
        <form className="col-md-6">
          <div className="bg-white p-4 border shadow-lg">
            <h4 className="fw-bold">1. 訂單資料</h4>
            <p className="mt-4">聯絡資料</p>
            <div className="mb-2">
              <Input
                id="email"
                labelText="Email"
                type="email"
                errors={errors}
                register={register}
                rules={{
                  required: "Email 為必填",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email 格式不正確",
                  },
                }}
              />
            </div>
            <div className="mb-2">
              <Input
                id="name"
                type="text"
                errors={errors}
                labelText="姓名"
                register={register}
                rules={{
                  required: "姓名為必填",
                  maxLength: {
                    value: 10,
                    message: "姓名長度不超過 10",
                  },
                }}
              />
            </div>
            <div className="mb-2">
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
            </div>
            <div className="mb-2">
              <Input
                id="address"
                labelText="地址"
                type="address"
                errors={errors}
                register={register}
                rules={{
                  required: "地址為必填",
                }}
              />
            </div>
          </div>

          <div className="bg-white p-4 mt-3 border shadow-lg">
            <h4 className="fw-bold">2. 宅配</h4>
            <div>
              <p className="mt-4 mb-3">住址</p>
              <div className="form-row">
                <div className="col mb-2">
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
                </div>
                <div className="col mb-2">
                  <Select
                    id="shippingCity"
                    errors={errors}
                    register={register}
                    rules={{
                      required: "請選擇城市",
                    }}
                    dataTestId="selectCity"
                  >
                    <option value="">城市</option>
                    <option>...</option>
                  </Select>
                </div>
              </div>
              <Input
                id="shippingAddress"
                type="text"
                errors={errors}
                register={register}
                rules={{
                  required: "請填寫配送地址",
                }}
                placeholder="地址"
              />
              <p className="mt-4 mb-2">付款方式</p>
              {errors["gridRadios"] && (
                <div className="invalid-feedback">
                  {errors["gridRadios"]?.message}
                </div>
              )}
              {["信用卡", "貨到付款", "ATM", "ApplyPay", "LinePay"].map(
                (item, i) => {
                  return (
                    <CheckboxRadio
                      key={`gridRadios${i}`}
                      id={`gridRadios${i}`}
                      labelText={item}
                      register={register}
                      type={"radio"}
                      errors={errors}
                      rules={{
                        required: "請選擇付款方式",
                      }}
                      value={item}
                      name={"gridRadios"}
                      payment={payment}
                      setPayment={setPayment}
                    >
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
                        handleChange={handleCardNumberChange}
                        format={formatCardNumber}
                        luhnCheck={luhnCheck}
                      />
                      <CardInput
                        id="cardExpiry"
                        type="text"
                        maxLength="5"
                        errors={errors}
                        register={register}
                        rules={{
                          required: "請輸入到期日",
                          pattern: {
                            value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                            message: "請輸入有效的 MM/YY 格式",
                          },
                        }}
                        placeholder="MM/YY"
                        handleChange={handleCardNumberChange}
                        format={formatExpiryDate}
                      />
                      <CardInput
                        id="cardSecurityCode"
                        type="text"
                        maxLength="4"
                        errors={errors}
                        register={register}
                        rules={{
                          required: "請輸入安全碼",
                          pattern: {
                            value: /^\d{3,4}$/,
                            message: "請輸入 3 或 4 位數的安全碼",
                          },
                        }}
                        placeholder="CVV"
                        handleChange={handleCardNumberChange}
                        format={formatCvvNumber}
                      />
                    </CheckboxRadio>
                  );
                }
              )}
            </div>
          </div>
        </form>
        <CartItem
          cartData={cartData}
          couponData={couponData}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          payment={payment}
        />
      </div>
    </div>
  );
}

const CartItem = memo(function CartItem({
  cartData,
  couponData,
  handleSubmit,
  onSubmit,
  payment,
}) {
  return (
    <div className="col-md-4">
      <div
        className="sticky-md-top shadow-lg bg-white border p-4"
        style={{ zIndex: "1000", top: "60px" }}
      >
        <h4 className="mb-4 fw-bold">3. 確認購物車內容</h4>
        {cartData?.carts?.map((item) => {
          return (
            <div
              className="d-flex"
              key={item.id}
              style={{ fontSize: "0.8rem" }}
            >
              <img
                src={item.product.imageUrl}
                alt=""
                className="me-2 object-cover"
                style={{ width: "70px", height: "70px" }}
              />
              <div className="w-100">
                <div className="d-flex justify-content-between fw-bold">
                  <p className="mb-0">{item.product.title}</p>
                  <p className="mb-0">x{item.qty}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="text-muted mb-0">
                    <small>NT${item.product.price}</small>
                  </p>
                  <p className="mb-0">NT${item.final_total}</p>
                </div>
              </div>
            </div>
          );
        })}

        <table className="table mt-4 border-top border-bottom text-muted">
          <tbody>
            <tr>
              <th scope="row" className="border-0 px-0 pt-4 font-weight-normal">
                合計
              </th>
              <td className="text-end border-0 px-0 pt-4">
                {cartData.total}元
              </td>
            </tr>
            {couponData.success && (
              <>
                <tr>
                  <th
                    scope="row"
                    className="border-0 px-0 pt-0 font-weight-normal"
                  >
                    折扣金額
                  </th>
                  <td className="text-end border-0 px-0 pt-0">
                    -{cartData.total - couponData.discountedTotal}元
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="border-0 px-0 pt-0 pb-4 font-weight-normal"
                  >
                    折扣碼
                  </th>
                  <td className="text-end border-0 px-0 pt-0 pb-4">
                    {couponData.code}
                  </td>
                </tr>
              </>
            )}
            <tr>
              <th
                scope="row"
                className="border-0 px-0 pt-0 pb-4 font-weight-normal"
              >
                付款方式
              </th>
              <td className="text-end border-0 px-0 pt-0 pb-4">
                {payment && payment}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="d-flex justify-content-between mt-2">
          <p className="mb-0 fw-bold">總計</p>
          <p className="mb-0 fw-bold">
            {couponData.success ? couponData.discountedTotal : cartData.total}{" "}
            元
          </p>
        </div>
        <div className="d-flex mt-4 justify-content-between align-items-center">
          <Link to={"/products"} className="text-dark">
            <i className="bi bi-caret-left"></i> 繼續購物
          </Link>
          <button
            type="button"
            className="btn btn-sm btn-dark p-2 rounded-3"
            onClick={() => handleSubmit(onSubmit)()}
          >
            送出訂單
          </button>
        </div>
      </div>
    </div>
  );
});

export default Checkout;
