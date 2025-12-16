import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, Menu, X, Sun, Moon } from "lucide-react";

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

  // Define NavLink styles for active/inactive states
  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 transition duration-150 rounded-lg font-medium ${
      isActive
        ? "text-white bg-indigo-600 dark:text-yellow-300 dark:bg-gray-800" // Active: Indigo background, White/Yellow text
        : "text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400" // Inactive: Hover Indigo
    }`;

  // Define Mobile NavLink styles
  const mobileNavLinkClass = ({ isActive }) =>
    `block w-full text-left px-4 py-3 transition duration-150 ${
      isActive
        ? "text-indigo-600 font-bold border-l-4 border-indigo-600 bg-indigo-50 dark:bg-gray-700 dark:text-yellow-300"
        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
    }`;

  return (
    <div className="flex items-center sticky top-0 bg-white dark:bg-gray-900 shadow-xl px-4 py-3 z-50 transition-colors duration-300">
      
      {/* LEFT LOGO (Fixed Width) */}
      {/* Removed flex-1 to prevent it from taking up excessive space */}
      <div className="flex items-center mr-6">
        <Link to="/homepage" className="flex items-center text-black no-underline">
          <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-yellow-300">
            SmartLMS
          </h1>
        </Link>
      </div>

      {/* MIDDLE NAV (Main Content Area) */}
      {/* Allows the middle section to grow but not dominate the layout */}
      <div className="hidden md:flex grow justify-center">
        {user && (
          <nav>
            <ul className="flex items-center space-x-2">
              {/* Instructor Menu */}
              {user.role?.toLowerCase() === "instructor" && (
                <>
                  <li>
                    <NavLink className={navLinkClass} to="/allcourses">
                      All Courses
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className={navLinkClass} to="/assignments">
                      Assignments
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className={navLinkClass} to="/courses/add">
                      Add Course
                    </NavLink>
                  </li>
                </>
              )}

              {/* Student Menu */}
              {user.role?.toLowerCase() === "student" && (
                <>
                  <li>
                    <NavLink className={navLinkClass} to="/allcourses">
                      All Courses
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className={navLinkClass} to="/assignments">
                      Assignments
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className={navLinkClass} to="/enrolledcourses">
                      My Courses
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>

      {/* RIGHT ICONS & AUTH BUTTONS (Fixed Width) */}
      <div className="ml-auto flex items-center space-x-4">
        {user ? (
          <>
            <button onClick={() => setDark(!dark)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-800 dark:text-gray-200">
              {dark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
            <Bell className="w-6 h-6 cursor-pointer text-gray-800 dark:text-gray-200" />
            <button
              onClick={logout}
              className="hidden md:block text-red-600 dark:text-red-400 font-semibold px-3 py-1 rounded-lg border border-red-600 hover:bg-red-50 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="flex space-x-3 font-medium text-gray-700 dark:text-gray-300">
            <NavLink to="/login" className="hover:text-indigo-600">Login</NavLink>
            <NavLink to="/register" className="text-indigo-600 dark:text-yellow-300 font-bold border-l pl-3 border-gray-300">Register</NavLink>
          </div>
        )}

        {/* MOBILE MENU BUTTON */}
        {user && (
          <div className="block md:hidden">
            <button
              onClick={() => setToggle(!toggle)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              {!toggle ? <Menu className="w-8 h-8" /> : <X className="w-8 h-8" />}
            </button>
          </div>
        )}
      </div>

      {/* MOBILE MENU PANEL */}
      <div
        className={`${
          toggle ? "translate-x-0" : "-translate-x-full"
        } md:hidden fixed top-16 left-0 bg-white dark:bg-gray-900 w-full h-full transition-transform duration-300 ease-in-out shadow-2xl z-40`}
      >
        <ul className="flex flex-col p-4 space-y-2">
          {user && (
            <>
              {/* Instructor Menu */}
              {user.role?.toLowerCase() === "instructor" && (
                <>
                  <li>
                    <NavLink className={mobileNavLinkClass} to="/allcourses" onClick={toggleClose}>
                      All Courses
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className={mobileNavLinkClass} to="/assignments" onClick={toggleClose}>
                      Assignments
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className={mobileNavLinkClass} to="/courses/add" onClick={toggleClose}>
                      Add Course
                    </NavLink>
                  </li>
                </>
              )}

              {/* Student Menu */}
              {user.role?.toLowerCase() === "student" && (
                <>
                  <li>
                    <NavLink className={mobileNavLinkClass} to="/allcourses" onClick={toggleClose}>
                      All Courses
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className={mobileNavLinkClass} to="/assignments" onClick={toggleClose}>
                      Assignments
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className={mobileNavLinkClass} to="/enrolledcourses" onClick={toggleClose}>
                      My Enrolled Courses
                    </NavLink>
                  </li>
                </>
              )}

              {/* Mobile Logout */}
              <li className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-3 font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800 transition"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;