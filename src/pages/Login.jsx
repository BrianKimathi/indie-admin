const Login = () => {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-8 bg-gray-200 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Login</h2>
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-2 border rounded"
          />
          <button className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
        </div>
      </div>
    );
  };
  
  export default Login;
  