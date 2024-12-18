import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Events from "./pages/Events";
import Inspirations from "./pages/Inspirations";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Features from "./pages/Features";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Router>
      <div className={`${darkMode ? "dark" : ""} flex flex-col h-screen`}>
        {isLoggedIn && <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
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
                  <Route
                    path="/login"
                    element={<Login setIsLoggedIn={setIsLoggedIn} />}
                  />
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
