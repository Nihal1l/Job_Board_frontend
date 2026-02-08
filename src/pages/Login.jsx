import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import ErroAlert from "../components/ErroAlert";
import { useState } from "react";

const Login = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const { errorMsg, loginUser, user, fetchUserProfile, resetPassword } =
    useAuthContext();
  const [loading, setLoading] = useState(false);
  console.log("user ===========", user);
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await loginUser(data);
      navigate("/dashboard");
    } catch (error) {
      console.log("Login Failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = getValues("email");
    if (!email) {
      alert("Please enter your email in the email field first.");
      return;
    }

    try {
      const response = await resetPassword(email);
      console.log("response======", response);

      if (response.success) {
        alert("Please check your email for the reset password link.");
      }
    } catch (error) {
      console.log("Reset Password failed", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          {errorMsg && <ErroAlert error={errorMsg} />}
          <h2 className="card-title text-2xl font-bold">Sign in</h2>
          <p className="text-base-content/70">
            Enter your email and password to access your account
          </p>

          <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <span className="label-text-alt text-error">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`input input-bordered w-full ${
                  errors.email ? "input-error" : ""
                }`}
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <span className="label-text-alt text-error">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Logging In..." : "Login"}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="btn btn-outline btn-primary w-full"
              >
                Forgot Password?
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="text-base-content/70">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="link link-primary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
