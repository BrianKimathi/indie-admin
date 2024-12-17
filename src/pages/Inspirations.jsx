import React, { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const Inspirations = () => {
  const [inspirations, setInspirations] = useState([
    {
      id: 1,
      title: "Game Strategy Guide",
      link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "A strategy guide for gamers.",
    },
    {
      id: 2,
      title: "Top 10 Gaming Tips",
      link: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
      description: "Improve your gaming skills.",
    },
  ]);

  const [newInspiration, setNewInspiration] = useState({
    title: "",
    link: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isAdmin] = useState(true);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewInspiration({ ...newInspiration, [name]: value });
  };

  // Extract YouTube Video ID
  const extractYouTubeID = (url) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Add or Update Inspiration
  const handleSubmit = (e) => {
    e.preventDefault();
    const videoID = extractYouTubeID(newInspiration.link);
    if (!videoID) {
      alert("Please enter a valid YouTube link.");
      return;
    }

    if (editingId) {
      setInspirations((prev) =>
        prev.map((insp) =>
          insp.id === editingId ? { ...newInspiration, id: editingId } : insp
        )
      );
      setEditingId(null);
    } else {
      setInspirations((prev) => [
        ...prev,
        { ...newInspiration, id: Date.now() },
      ]);
    }

    setNewInspiration({ title: "", link: "", description: "" });
    setIsFormVisible(false);
  };

  // Edit Inspiration
  const handleEdit = (id) => {
    const inspiration = inspirations.find((insp) => insp.id === id);
    setNewInspiration(inspiration);
    setEditingId(id);
    setIsFormVisible(true);
  };

  // Delete Inspiration
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this inspiration?")) {
      setInspirations((prev) => prev.filter((insp) => insp.id !== id));
    }
  };

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Manage Inspirations</h1>

      {/* Toggle Form */}
      <div
        className="flex items-center justify-between cursor-pointer bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded mb-4"
        onClick={() => setIsFormVisible(!isFormVisible)}
      >
        <h2 className="text-lg font-bold">
          {editingId ? "Edit Inspiration" : "Add New Inspiration"}
        </h2>
        {isFormVisible ? (
          <ChevronUpIcon className="w-6 h-6" />
        ) : (
          <ChevronDownIcon className="w-6 h-6" />
        )}
      </div>

      {/* Form */}
      {isFormVisible && isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 border rounded bg-gray-100 dark:bg-gray-800"
        >
          <div className="mb-4">
            <label className="block font-semibold mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={newInspiration.title}
              onChange={handleChange}
              placeholder="Inspiration Title"
              className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">YouTube Link</label>
            <input
              type="url"
              name="link"
              value={newInspiration.link}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
              className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={newInspiration.description}
              onChange={handleChange}
              placeholder="Short description"
              rows="3"
              className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingId ? "Update Inspiration" : "Add Inspiration"}
          </button>
        </form>
      )}

      {/* Grid of Inspirations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inspirations.map((insp) => {
          const videoID = extractYouTubeID(insp.link);
          return (
            <div
              key={insp.id}
              className="p-4 border rounded bg-white dark:bg-gray-800 shadow flex flex-col"
            >
              <h2 className="text-lg font-bold mb-2">{insp.title}</h2>
              <div className="relative w-full h-0 pb-[56.25%] mb-2">
                {videoID && (
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded"
                    src={`https://www.youtube.com/embed/${videoID}`}
                    title={insp.title}
                    allowFullScreen
                  ></iframe>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-2 flex-grow">
                {insp.description}
              </p>
              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(insp.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(insp.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Inspirations;
