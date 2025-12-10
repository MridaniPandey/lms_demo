import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { EyeOff, Bell, Menu, X, Sun, Moon } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
    } catch (err) {
      console.warn("Failed to parse user from localStorage:", err);
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  // Listen for custom 'userChanged' event to update Header immediately
  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    window.addEventListener("userChanged", updateUser);
    return () => window.removeEventListener("userChanged", updateUser);
  }, []);

  const toggleClose = () => setToggle(false);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Dark mode handling
  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <div className="flex items-center sticky top-0 bg-white shadow-md px-4 py-3 z-50">
      {/* LEFT LOGO */}
      <div className="flex items-center mr-10 flex-1">
        <Link to="/" className="flex items-center text-black no-underline">
          <h1 className="text-black font-semibold text-2xl">LMS</h1>
        </Link>
      </div>

      {/* MIDDLE NAV */}
      <div
        className={`${
          toggle ? "block" : "hidden"
        } md:flex flex-1 md:static absolute top-16 left-0 bg-white md:bg-transparent w-[70vw] md:w-auto h-screen md:h-auto border-r md:border-none transition-all duration-300`}
      >
        {user && (
          <ul className="md:flex md:items-center mt-4 md:mt-0">
            {/* Instructor Menu */}
            {user.role?.toLowerCase() === "instructor" && (
              <>
                <li className="border-b md:border-none py-3 md:py-0">
                  <NavLink className="px-4" to="/allcourses" onClick={toggleClose}>
                    All Courses
                  </NavLink>
                </li>
                <li className="border-b md:border-none py-3 md:py-0">
                  <NavLink className="px-4" to="/assignments" onClick={toggleClose}>
                    Assignments
                  </NavLink>
                </li>
                <li className="border-b md:border-none py-3 md:py-0">
                  <NavLink className="px-4" to="/courses/add" onClick={toggleClose}>
                    Add Course
                  </NavLink>
                </li>
              </>
            )}

            {/* Student Menu */}
            {user.role?.toLowerCase() === "student" && (
              <>
                <li className="border-b md:border-none py-3 md:py-0">
                  <NavLink className="px-4" onClick={toggleClose} to="/allcourses">
                    All Courses
                  </NavLink>
                </li>
                <li className="border-b md:border-none py-3 md:py-0">
                  <NavLink className="px-4" onClick={toggleClose} to="/assignments">
                    Assignments
                  </NavLink>
                </li>
                <li className="border-b md:border-none py-3 md:py-0">
                  <NavLink className="px-4" to="/enrolled-courses" onClick={toggleClose}>
                    Enrolled Courses
                  </NavLink>
                </li>
              </>
            )}

            {/* MOBILE LOGOUT */}
            <li className="py-3 md:py-0 md:hidden px-4">
              <button onClick={logout} className="text-red-600">
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>

      {/* RIGHT ICONS (DESKTOP) */}
      {user ? (
        <div className="hidden md:flex items-center space-x-4">
          <button onClick={() => setDark(!dark)}>
            {dark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
          <EyeOff className="w-6 h-6 cursor-pointer" />
          <Bell className="w-6 h-6 cursor-pointer" />
          <button onClick={logout} className="text-red-600 font-medium">
            Logout
          </button>
        </div>
      ) : (
        <div className="flex space-x-4">
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
        </div>
      )}

      {/* MOBILE MENU BUTTON */}
      {user && (
        <div className="block md:hidden ml-auto">
          <button onClick={() => setToggle(!toggle)}>
            {!toggle ? <Menu className="w-8 h-8" /> : <X className="w-8 h-8" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
