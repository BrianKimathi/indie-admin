import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice"; // Redux actions
import { auth, db } from "../config/firebase"; // Firebase config
import { ref, onValue } from "firebase/database"; // Firebase Realtime Database methods

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminEmails, setAdminEmails] = useState([]); // Admin emails state
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch admin emails from Realtime Database
    const adminEmailsRef = ref(db, "settings/adminEmails");
    onValue(adminEmailsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert Firebase object into a plain array
        const emails = Object.values(data);
        setAdminEmails(emails);
      }
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if the email is in the adminEmails list
      if (!adminEmails.includes(email)) {
        throw new Error("Unauthorized!!! Insufficient rights.");
      }

      // Proceed with Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        user: { email: user.email, uid: user.uid },
        role: "admin", // Assign role dynamically if needed
      };

      // Save user and role to Redux and localStorage
      dispatch(setUser(userData));
      localStorage.setItem("authUser", JSON.stringify(userData.user));
      localStorage.setItem("authRole", userData.role);

      // Set session timeout (5 minutes)
      setTimeout(() => {
        dispatch({ type: "auth/logout" }); // Dispatch logout after timeout
      }, 1 * 60 * 1000); // 5 minutes

      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-gray-200">
          Admin Login
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-gray-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
