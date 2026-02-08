import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import About from "../pages/About";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "../components/PrivateRoute";
import ActivateAccount from "../components/Registration/ActivateAccount";
import DashboardLayout from "../layouts/DashboardLayout";
import Profile from "../pages/Profile";
import ResetPasswordConfirm from "../components/Registration/ResetPasswordConfirm";
import PostJob from "../pages/PostJob";
import UpgradePlan from "../pages/UpgradePlan";
import ContactPage from "../pages/ContactPage";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentCancel from "../pages/PaymentCancel";
import PaymentFail from "../pages/PaymentFail";

const AppRoutes = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Public Routes  */}

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="upgrade-plan" element={<UpgradePlan />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="activate/:uid/:token" element={<ActivateAccount />} />
          <Route
            path="password/reset/confirm/:uid/:token"
            element={<ResetPasswordConfirm />}
          />
          <Route path="payment/success" element={<PaymentSuccess />} />
          <Route path="payment/cancel" element={<PaymentCancel />} />
          <Route path="payment/fail" element={<PaymentFail />} />
        </Route>
        {/* Private Routes  */}
        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
