import { useState, useEffect } from "react";
import {
  BellIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const Navbar = ({ darkMode, toggleDarkMode, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 py-3 shadow-md z-50 transition-all ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
      }`}
    >
      {/* Logo and Mobile Menu */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <div className="text-xl font-bold">Indie Games</div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`absolute top-full left-0 w-full p-4 shadow-md md:hidden ${
            darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
          }`}
        >
          <ul className="space-y-4">
            <li>
              <a href="/" className="block hover:text-blue-500">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/events" className="block hover:text-blue-500">
                Events
              </a>
            </li>
            <li>
              <a href="/inspirations" className="block hover:text-blue-500">
                Inspirations
              </a>
            </li>
            <li>
              <a href="/users" className="block hover:text-blue-500">
                Users
              </a>
            </li>
          </ul>
        </div>
      )}

      {/* Icons */}
      <div className="flex items-center gap-4">

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          aria-label="Toggle Dark Mode"
          className="hover:text-blue-500"
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6 cursor-pointer" />
          ) : (
            <MoonIcon className="h-6 w-6 cursor-pointer" />
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative dropdown">
          <UserCircleIcon
            className="h-8 w-8 cursor-pointer hover:text-blue-500"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="User Profile"
          />
          {dropdownOpen && (
            <div
              className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10 ${
                darkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
              }`}
            >
              <ul>
                <li
                  className="hover:bg-gray-100 dark:hover:bg-gray-600 p-2 cursor-pointer"
                  onClick={() => navigate("/profile")} // Navigate to /profile
                >
                  Profile
                </li>
                {/* <li className="hover:bg-gray-100 dark:hover:bg-gray-600 p-2">
                  <a href="/settings" className="block">
                    Settings
                  </a>
                </li> */}
                <li
                  className="hover:bg-gray-100 dark:hover:bg-gray-600 p-2 cursor-pointer"
                  onClick={onLogout} // Call the onLogout function
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
