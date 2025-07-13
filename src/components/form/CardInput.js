const CardInput = ({
  id,
  maxLength,
  register,
  type,
  errors,
  rules,
  placeholder,
  handleChange,
  format,
  luhnCheck,
}) => {
  return (
    <>
      <input
        id={id}
        type={type}
        maxLength={maxLength}
        className={`form-control rounded-3 ${errors[id] && "is-invalid"}`}
        placeholder={placeholder}
        autoComplete="off"
        inputMode="numeric"
        {...register(id, {
          ...rules,
          onChange: (e) => {
            handleChange(e, id, format);
          },
          validate: (value) => {
            if (luhnCheck) {
              const isValid = luhnCheck(value);
              return isValid || "無效的信用卡";
            }
          },
        })}
      />
      {errors[id] && (
        <div className="invalid-feedback">{errors[id]?.message}</div>
      )}
    </>
  );
};

export default CardInput;
