import { Link, useLocation } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import useUnreadCount from "../hooks/useUnreadCount";

const Navbar = () => {
  const { user, logoutUser } = useAuthContext();
  const { unreadCount } = useUnreadCount();
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
                {/* {!user?.is_staff && (
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                )} */}
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
            </li>
           
            {user?.is_staff==false && (
            <li>
              <Link to="/upgrade-plan" className="text-primary font-bold">
                Be a Premium User
              </Link>
            </li>
            )}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">Job Venue</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link to="/">Home</Link>
          </li>
          
                       {user?.is_staff==false && (
                <li>
                  <Link to="/jobs">Jobs</Link>
                </li>
                 )}
                
              
            
          {user?.is_staff && (
                  <li>
                    <Link to="/post-job" className="text-primary font-semibold">
                      Post a Job
                    </Link>
                  </li>
                )}
          
                  <li>
                    <Link to="/findCompany" className="text-primary font-semibold">
                      Companies
                    </Link>
                  </li>
                
          {user?.is_staff==false && (
            <li>
              <Link to="/upgrade-plan" className="text-primary font-bold">
                Be a Premium User
              </Link>
            </li>
            )}
        </ul>
      </div>
      <div className="navbar-end">
        {user ? (
          <div className="flex items-center gap-2">
            <Link to="/dashboard/chat" className="btn btn-ghost btn-circle" title="Messages">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {unreadCount > 0 && (
                  <span className="badge badge-sm badge-secondary indicator-item">{unreadCount}</span>
                )}
              </div>
            </Link>
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
                {user?.is_staff ? (
                  <li>
                    <Link to="/admin-dashboard" className="justify-between text-purple-600 font-semibold">
                      Dashboard
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link to="/dashboard" className="justify-between">
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/dashboard/chat" className="justify-between">
                    Messages
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/profile" className="justify-between">
                    Profile
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
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn btn-outline btn-primary px-6">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary shadow-md px-6">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;