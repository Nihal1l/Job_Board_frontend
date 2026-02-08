import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../services/api-client";

const ResetPasswordConfirm = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Resetting password...");
  const [new_password, setNewPassword] = useState("");

  useEffect(() => {
    const resetPassword = async () => {
      try {
        await apiClient.post("/auth/users/reset_password_confirm/", {
          uid,
          token,
          new_password,
        });
        setStatus("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } catch (error) {
        console.error("Password reset failed", error);
        setStatus("Password reset failed. The link may be invalid or expired.");
      }
    };

    if (uid && token && new_password) {
      resetPassword();
    }
  }, [uid, token, new_password, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Password Reset Confirmation</h2>
          <p>{status}</p>
          <input
            type="password"
            placeholder="New Password"
            className="input input-bordered w-full max-w-xs"
            value={new_password}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className="btn btn-primary" onClick={setNewPassword}>
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;
