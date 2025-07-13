import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Input } from "../../components/form/FormElements";

function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  const [loginState, setLoginState] = useState({});

  const submit = async (data) => {
    const { email, password } = data;
    const loginData = {
      username: email,
      password: password,
    };
    try {
      const res = await axios.post(`/v2/admin/signin`, loginData);
      const { token, expired } = res.data;
      //存儲Token
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      if (res.data.success) {
        navigate("/admin/products");
      }
    } catch (error) {
      setLoginState(error.response.data);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>後台登入系統</h2>
          {/*登入error*/}
          <div
            className={`alert alert-danger ${
              loginState?.message ? "d-block" : "d-none"
            }`}
            role="alert"
          >
            {loginState?.message}
          </div>
          <div className="mb-2">
            <Input
              id="email"
              labelText="Email"
              name="username"
              type="email"
              errors={errors}
              placeholder="Email Address"
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
              id="password"
              labelText="密碼"
              name="password"
              type="password"
              errors={errors}
              placeholder="*******"
              register={register}
              rules={{
                required: "密碼為必填",
              }}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit(submit)}
          >
            登入
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
