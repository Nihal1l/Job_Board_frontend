import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../services/api-client";

const ActivateAccount = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Activating...");

  useEffect(() => {
    const activateUser = async () => {
      try {
        await apiClient.post("/auth/users/activation/", { uid, token });
        setStatus("Account activated successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } catch (error) {
        console.error("Activation failed", error);
        setStatus("Activation failed. The link may be invalid or expired.");
      }
    };

    if (uid && token) {
      activateUser();
    }
  }, [uid, token, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Account Activation</h2>
          <p>{status}</p>
        </div>
      </div>
    </div>
  );
};

export default ActivateAccount;
