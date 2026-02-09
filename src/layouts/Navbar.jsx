import { Link, useLocation } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

const Navbar = () => {
  const { user, logoutUser } = useAuthContext();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className={`navbar bg-base-100 shadow-sm ${isHome ? 'fixed top-0 left-0 right-0 z-50' : ''}`}>
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <a>Jobs</a>
              <ul className="p-2">
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/jobs">Job List</Link>
                </li>
                <li>
                  <Link to="/apply">Job Apply</Link>
                </li>
                {user?.is_staff && (
                  <li>
                    <Link to="/post-job" className="text-primary font-semibold">
                      Post a Job
                    </Link>
                  </li>
                )}
              </ul>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/upgrade-plan" className="text-primary font-bold">
                Premier User
              </Link>
            </li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">Job Portal</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <details className="z-50">
              <summary>Jobs</summary>
              <ul className="p-2 w-48 shadow-lg bg-base-100 rounded-box">
                {/* <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li> */}
                <li>
                  <Link to="/jobs">Job List</Link>
                </li>
                {/* <li>
                  <Link to="/apply">Job Apply</Link>
                </li> */}
                {user?.is_staff && (
                  <li>
                    <Link to="/post-job" className="text-primary font-semibold">
                      Post a Job
                    </Link>
                  </li>
                )}
              </ul>
            </details>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          {/* <li>
            <Link to="/contact">Contact</Link>
          </li> */}
          <li>
            <Link to="/upgrade-plan" className="text-primary font-bold">
              Be a Premium User
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <div>
            {/* <div className="dropdown dropdown-end mr-4">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {" "}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />{" "}
                  </svg>
                  <span className="badge badge-sm indicator-item">8</span>
                </div>
              </div>
              <div
                tabIndex={0}
                className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow"
              >
                <div className="card-body">
                  <span className="text-lg font-bold">8 Items</span>
                  <span className="text-info">Subtotal: ৳999</span>
                  <div className="card-actions">
                    <button className="btn btn-primary btn-block">
                      View cart
                    </button>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/dashboard" className="justify-between">
                    Dashboard
                    {/* <span className="badge badge-primary">Admin</span> */}
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/profile" className="justify-between">
                    Profile
                    {/* <span className="badge">New</span> */}
                  </Link>
                </li>
                {/* <li>
                  <Link to="/dashboard/settings">Settings</Link>
                </li> */}
                <li>
                  <a onClick={logoutUser}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link to="/login" className="btn btn-secondary">
              Login
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;