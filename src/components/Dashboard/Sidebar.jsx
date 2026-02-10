import { Link } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";

const Sidebar = () => {
  const { user } = useAuthContext();
  return (
    <div className="drawer-side">
      <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
      <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        {/* Sidebar content here */}
        {user?.is_staff ? (
          <li>
            <Link to="/admin-dashboard" className="text-purple-600 font-semibold">Admin Dashboard</Link>
          </li>
        ) : (
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        )}
        <li>
          <Link to="/dashboard/profile">Profile</Link>
        </li>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
