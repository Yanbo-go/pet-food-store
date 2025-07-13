export const CheckboxRadio = ({
  id,
  labelText,
  register,
  type,
  errors,
  rules,
  value,
  name,
  payment,
  setPayment,
  children,
}) => {
  return (
    <>
      <div className="form-check mb-2">
        <input
          className={`form-check-input ${errors[name] && "is-invalid"}`}
          type={type}
          name={name}
          id={id}
          value={value}
          onClick={() => setPayment(value)}
          {...register(name, rules)}
        />
        <label className={`form-check-label text-muted`} htmlFor={id}>
          {labelText}
        </label>
        {payment === "信用卡" && value === "信用卡" && children}
      </div>
    </>
  );
};

export const Input = ({
  id,
  labelText,
  maxLength,
  register,
  type,
  errors,
  rules,
  placeholder,
  name,
}) => {
  return (
    <>
      {labelText && (
        <label htmlFor={id} className="form-label">
          {labelText}
        </label>
      )}
      <input
        id={id}
        type={type}
        name={name}
        maxLength={maxLength ? maxLength : ""}
        className={`form-control rounded-3 ${errors[id] && "is-invalid"}`}
        placeholder={placeholder ? placeholder : ""}
        {...register(id, rules)}
      />
      {errors[id] && (
        <div className="invalid-feedback">{errors[id]?.message}</div>
      )}
    </>
  );
};

export const Select = ({
  id,
  labelText,
  register,
  errors,
  rules,
  children,
  disabled = false,
  dataTestId,
}) => {
  return (
    <>
      {labelText && (
        <label htmlFor={id} className="form-label">
          {labelText}
        </label>
      )}
      <select
        id={id}
        className={`form-select rounded-3 ${errors[id] && "is-invalid"}`}
        {...register(id, rules)}
        disabled={disabled}
        data-testid={dataTestId}
      >
        {children}
      </select>
      {errors[id] && (
        <div className="invalid-feedback">{errors[id]?.message}</div>
      )}
    </>
  );
};
