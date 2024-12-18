import React, { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const Features = () => {
  const [features, setFeatures] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/150",
      author: "John Doe",
      link: "https://example.com/author-work",
    },
  ]);

  const [newFeature, setNewFeature] = useState({
    image: "",
    author: "",
    link: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFeature({ ...newFeature, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setFeatures(
        features.map((feature) =>
          feature.id === editingId ? { ...newFeature, id: editingId } : feature
        )
      );
      setEditingId(null);
    } else {
      setFeatures([...features, { ...newFeature, id: Date.now() }]);
    }

    setNewFeature({ image: "", author: "", link: "" });
    setIsFormVisible(false);
  };

  const handleEdit = (id) => {
    const feature = features.find((feature) => feature.id === id);
    setNewFeature(feature);
    setEditingId(id);
    setIsFormVisible(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this feature?")) {
      setFeatures(features.filter((feature) => feature.id !== id));
    }
  };

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Manage Featured Arts</h1>

      <div
        className="flex items-center justify-between cursor-pointer bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded mb-4"
        onClick={() => setIsFormVisible(!isFormVisible)}
      >
        <h2 className="text-lg font-bold">
          {editingId ? "Edit Featured Art" : "Add New Featured Art"}
        </h2>
        {isFormVisible ? (
          <ChevronUpIcon className="w-6 h-6" />
        ) : (
          <ChevronDownIcon className="w-6 h-6" />
        )}
      </div>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-100 dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Image URL</label>
              <input
                type="url"
                name="image"
                value={newFeature.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Author</label>
              <input
                type="text"
                name="author"
                value={newFeature.author}
                onChange={handleChange}
                placeholder="Author Name"
                className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">Author Link</label>
              <input
                type="url"
                name="link"
                value={newFeature.link}
                onChange={handleChange}
                placeholder="Author's Work URL"
                className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingId ? "Update Featured Art" : "Add Featured Art"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {features.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No featured arts added yet.</p>
        ) : (
          features.map((feature) => (
            <div
              key={feature.id}
              className="p-4 border rounded bg-white dark:bg-gray-800 shadow flex flex-col md:flex-row justify-between items-start"
            >
              <div className="flex items-start gap-4">
                <img
                  src={feature.image}
                  alt="Featured Art"
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="text-lg font-bold">{feature.author}</h2>
                  <p>
                    <a
                      href={feature.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Author's Work
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  onClick={() => handleEdit(feature.id)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(feature.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Features;
