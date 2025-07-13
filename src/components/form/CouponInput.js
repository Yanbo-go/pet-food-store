import useDebounce from "../../hooks/useDebounce";

const CouponInput = ({
  id,
  labelText,
  type,
  couponCode,
  setCouponCode,
  checkCoupon,
  clearCoupon,
  couponData,
}) => {
  const debouncedResults = useDebounce(checkCoupon, 1000);

  const handleChangeCouponInput = (e) => {
    const value = e.target.value;
    setCouponCode(value);
    debouncedResults(value);
  };

  return (
    <>
      <div>
        {labelText !== "" && (
          <label htmlFor={id} className="form-label">
            {labelText}
          </label>
        )}
        {couponData.success && (
          <button
            type="button"
            className="btn btn-danger p-1 m-1"
            onClick={clearCoupon}
          >
            取消折扣碼
          </button>
        )}
        <input
          id={id}
          type={type}
          value={couponCode}
          maxLength="8"
          title="折扣碼為8碼唷~"
          aria-label={`輸入折扣碼`}
          className={`form-control form-control-sm rounded-3  ${
            couponData.success && "is-valid"
          }`}
          disabled={couponData.success ? true : false}
          onChange={handleChangeCouponInput}
        />
        {couponData && <div className="">{couponData.message}</div>}
      </div>
    </>
  );
};

export default CouponInput;
