const ProfileDropdown = () => {
    const isLoggedIn = true; // Replace with auth logic
  
    return (
      <div className="absolute right-0 mt-2 bg-white text-black shadow-md rounded-lg w-48">
        {isLoggedIn ? (
          <>
            <button className="block w-full px-4 py-2 text-left hover:bg-gray-200">
              Logout
            </button>
          </>
        ) : (
          <button className="block w-full px-4 py-2 text-left hover:bg-gray-200">
            Login
          </button>
        )}
      </div>
    );
  };
  
  export default ProfileDropdown;
  