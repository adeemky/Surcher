import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import icon from "../images/s.png";
import userIcon from "../images/user.png";

const Navbar = ({ isAuthenticated, onLogout, userInfo }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setTimeout(() => setDropdownOpen(false), 150);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-slate-950 shadow-md fixed top-0 left-0 right-0 z-10">
      <div
        ref={menuRef}
        className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-3 items-center font-nunito"
      >
        <div className="flex justify-start lg:hidden col-span-1">
          <button className="text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </div>
        <div className="flex justify-center lg:justify-start col-span-1">
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-bold text-yellow-50 flex-shrink-0"
          >
            <img src={icon} className="h-8 w-auto flex-shrink-0" />
            <span className="whitespace-nowrap text-yellow-50">Surcher</span>
          </Link>
        </div>
        {!isAuthenticated && <div className="flex justify-end lg:hidden col-span-1"></div>}
        {isAuthenticated && (
          <div className="flex justify-end lg:hidden col-span-1 items-center space-x-2">
            <img src={userIcon} className="h-6 w-6 rounded-full" alt="user" />
            <button
              onClick={onLogout}
              className="text-sm bg-amber-500 text-white px-2 py-1 rounded hover:bg-amber-600"
            >
              Logout
            </button>
          </div>
        )}

        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } col-span-3 lg:col-span-1 lg:col-start-3 absolute top-full left-0 w-full flex-col bg-slate-950 lg:static lg:flex lg:flex-row items-start lg:items-center justify-end p-4 lg:p-0 gap-y-2 lg:gap-x-6`}
        >
          <Link to="/" className="text-yellow-50 hover:text-amber-200 transition">
            Home
          </Link>
          <Link to="/contact" className="text-yellow-50 hover:text-amber-200 transition">
            Contact
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/surveys" className="text-yellow-50 hover:text-amber-200 transition">
                Surveys
              </Link>
              <Link to="/results" className="text-yellow-50 hover:text-amber-200 transition">
                Results
              </Link>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Link to="/login" className="text-yellow-50 hover:text-amber-200 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600"
              >
                Register
              </Link>
            </>
          )}
          {/* Desktop user dropdown remains, mobile user/logout handled above */}
          {isAuthenticated && (
            <div ref={dropdownRef} className="relative justify-end hidden lg:flex">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 text-yellow-50 hover:text-amber-200 transition"
              >
                <img src={userIcon} className="h-6 w-6 rounded-full" alt="user" />
                <span className="text-sm hidden lg:inline">
                  {userInfo?.name || userInfo?.username || "User"}
                </span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg border border-gray-200 z-50">
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-white bg-amber-500 hover:bg-amber-600 rounded-b"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
