import React, { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", role: "admin" },
    { id: 2, name: "Jane Smith", role: "editor" },
    { id: 3, name: "Alice Johnson", role: "viewer" },
  ]);

  const [newUser, setNewUser] = useState({ name: "", role: "viewer" });
  const [editingId, setEditingId] = useState(null);
  const [isAdmin] = useState(true); // Replace with real authentication logic
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Add or Update a User
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setUsers(
        users.map((user) =>
          user.id === editingId ? { ...newUser, id: editingId } : user
        )
      );
      setEditingId(null);
    } else {
      setUsers([...users, { ...newUser, id: Date.now() }]);
    }
    setNewUser({ name: "", role: "viewer" });
    setIsFormVisible(false);
  };

  // Edit User
  const handleEdit = (id) => {
    const user = users.find((user) => user.id === id);
    setNewUser(user);
    setEditingId(id);
    setIsFormVisible(true);
  };

  // Delete User
  const handleDelete = (id, role) => {
    if (role === "admin") {
      alert("You cannot delete another admin.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">User Management</h1>

      {/* Toggle Form */}
      <div
        className="flex items-center justify-between cursor-pointer bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded mb-4"
        onClick={() => setIsFormVisible(!isFormVisible)}
      >
        <h2 className="text-lg font-bold">
          {editingId ? "Edit User" : "Add New User"}
        </h2>
        {isFormVisible ? (
          <ChevronUpIcon className="w-6 h-6" />
        ) : (
          <ChevronDownIcon className="w-6 h-6" />
        )}
      </div>

      {/* User Form */}
      {isAdmin && isFormVisible && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 border rounded bg-gray-100 dark:bg-gray-800"
        >
          <div className="mb-4">
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={newUser.name}
              onChange={handleChange}
              placeholder="User Name"
              className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Role</label>
            <select
              name="role"
              value={newUser.role}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
              required
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingId ? "Update User" : "Add User"}
          </button>
        </form>
      )}

      {/* User List */}
      <div className="space-y-4">
        {users.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No users found.</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="p-4 border rounded bg-white dark:bg-gray-800 shadow flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <h2 className="font-bold text-lg">{user.name}</h2>
                <p className="text-gray-700 dark:text-gray-300 capitalize">
                  Role: <span className="font-semibold">{user.role}</span>
                </p>
              </div>
              {isAdmin && (
                <div className="flex gap-2 mt-2 md:mt-0">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  )}
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleDelete(user.id, user.role)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Users;
