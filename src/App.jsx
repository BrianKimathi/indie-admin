import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ref, get, set, update } from "firebase/database"; // Firebase methods
import { db } from "./config/firebase"; // Firebase configuration
import { setUser, logout } from "./store/authSlice";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Events from "./pages/Events";
import PastEvents from "./pages/PastEvents";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Features from "./pages/Features";
import Profile from "./pages/Profile";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    return storedDarkMode === "true";
  });

  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const SESSION_TIMEOUT = 1 * 60 * 1000; // 5 minutes

  useEffect(() => {

    const restoreSession = () => {
      try {
        const storedUser = localStorage.getItem("authUser");
        const storedRole = localStorage.getItem("authRole");
        const sessionStartTime = localStorage.getItem("sessionStartTime");

        if (storedUser && storedRole && sessionStartTime) {
          const sessionExpiry = parseInt(sessionStartTime, 10) + SESSION_TIMEOUT;

          if (Date.now() >= sessionExpiry) {
            // Session expired
            handleLogout();
          } else {
            const remainingTime = sessionExpiry - Date.now();
            dispatch(
              setUser({
                user: JSON.parse(storedUser),
                role: storedRole,
              })
            );
            // Schedule automatic logout
            scheduleLogout(remainingTime);
          }
        }
      } catch (error) {
        console.error("Error restoring session:", error);
      }
    };

    restoreSession();
  }, [dispatch]);

  const scheduleLogout = (timeout) => {
    setTimeout(() => {
      handleLogout();
    }, timeout);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("authUser");
    localStorage.removeItem("authRole");
    localStorage.removeItem("sessionStartTime");
  };

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Router>
      <div className={`${darkMode ? "dark" : ""} flex flex-col h-screen`}>
        {isAuthenticated && (
          <Navbar
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            onLogout={handleLogout}
          />
        )}
        <div className="flex flex-1">
          {isAuthenticated && <Sidebar darkMode={darkMode} />}
          <main
            className={`flex-1 p-4 overflow-auto bg-gray-50 dark:bg-gray-900 transition-all ${
              isAuthenticated ? "pt-16 md:pl-60" : ""
            }`}
          >
            <Routes>
              {isAuthenticated ? (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/past-events" element={<PastEvents />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/profile" element={<Profile />} />
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
