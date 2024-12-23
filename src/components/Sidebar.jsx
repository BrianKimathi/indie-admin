import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ darkMode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Collapsed sidebar state
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Mobile toggle state

  const links = [
    { name: "Dashboard", path: "/" },
    // { name: "Users", path: "/users" },
    { name: "Events", path: "/events" },
    { name: "Featured Arts", path: "/features" },
    { name: "Past Events", path: "/past-events" },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-64px)] ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
        } border-r transition-all duration-300 z-40 ${
          isCollapsed ? "w-16" : "w-60"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Sidebar Header */}
        <div
          className={`p-4 flex items-center justify-between ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } border-b`}
        >
          {!isCollapsed && <span className="font-bold text-xl">Admin</span>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hover:text-blue-500 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {isCollapsed ? (
              <ChevronDoubleRightIcon className="h-6 w-6" />
            ) : (
              <ChevronDoubleLeftIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2 rounded transition-all ${
                  isActive
                    ? darkMode
                      ? "text-blue-400"
                      : "text-blue-600"
                    : darkMode
                    ? "text-gray-300 hover:text-gray-100"
                    : "text-gray-700 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex-1">{!isCollapsed && link.name}</span>
                  {isActive && !isCollapsed && (
                    <ChevronRightIcon className="h-5 w-5 text-blue-500" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
