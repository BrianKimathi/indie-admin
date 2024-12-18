import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser, logout } from "./store/authSlice"; // Redux actions
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Events from "./pages/Events";
import Inspirations from "./pages/Inspirations";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Features from "./pages/Features";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Retrieve dark mode preference from localStorage
    const storedDarkMode = localStorage.getItem("darkMode");
    return storedDarkMode === "true";
  });

  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user session exists in localStorage and restore it
    const storedUser = localStorage.getItem("authUser");
    const storedRole = localStorage.getItem("authRole");

    if (storedUser && storedRole) {
      dispatch(setUser({ user: JSON.parse(storedUser), role: JSON.parse(storedRole) }));
    }
  }, [dispatch]);

  useEffect(() => {
    // Save dark mode preference to localStorage
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    dispatch(logout());
    // Clear session data from localStorage
    localStorage.removeItem("authUser");
    localStorage.removeItem("authRole");
  };

  return (
    <Router>
      <div className={`${darkMode ? "dark" : ""} flex flex-col h-screen`}>
        {isLoggedIn && (
          <Navbar
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            onLogout={handleLogout}
          />
        )}
        <div className="flex flex-1">
          {isLoggedIn && <Sidebar darkMode={darkMode} />}
          <main
            className={`flex-1 p-4 overflow-auto bg-gray-50 dark:bg-gray-900 transition-all ${
              isLoggedIn ? "pt-16 md:pl-60" : ""
            }`}
          >
            <Routes>
              {isLoggedIn ? (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/inspirations" element={<Inspirations />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              ) : (
                <>
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<Navigate to="/login" />} />
                </>
              )}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
