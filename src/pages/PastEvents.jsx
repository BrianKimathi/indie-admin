import React, { useState, useEffect } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { ref, push, update, remove, onValue } from "firebase/database"; // Firebase Realtime Database methods
import { db } from "../config/firebase"; // Firebase config

const PastEvents = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    link: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isAdmin] = useState(true);

  useEffect(() => {
    // Fetch past events from Firebase
    const pastEventsRef = ref(db, "pastEvents/");
    onValue(pastEventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setPastEvents(formattedData);
      }
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const extractYouTubeID = (url) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const videoID = extractYouTubeID(newEvent.link);
    if (!videoID) {
      alert("Please enter a valid YouTube link.");
      return;
    }

    if (editingId) {
      // Update existing event in Firebase
      const eventRef = ref(db, `pastEvents/${editingId}`);
      update(eventRef, newEvent);
      setEditingId(null);
    } else {
      // Add new event to Firebase
      const pastEventsRef = ref(db, "pastEvents/");
      push(pastEventsRef, newEvent);
    }

    setNewEvent({ title: "", link: "", description: "" });
    setIsFormVisible(false);
  };

  const handleEdit = (id) => {
    const event = pastEvents.find((evt) => evt.id === id);
    setNewEvent(event);
    setEditingId(id);
    setIsFormVisible(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const eventRef = ref(db, `pastEvents/${id}`);
      remove(eventRef);
    }
  };

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Manage Past Events</h1>

      <div
        className="flex items-center justify-between cursor-pointer bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded mb-4"
        onClick={() => setIsFormVisible(!isFormVisible)}
      >
        <h2 className="text-lg font-bold">
          {editingId ? "Edit Event" : "Add New Event"}
        </h2>
        {isFormVisible ? (
          <ChevronUpIcon className="w-6 h-6" />
        ) : (
          <ChevronDownIcon className="w-6 h-6" />
        )}
      </div>

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
              value={newEvent.title}
              onChange={handleChange}
              placeholder="Event Title"
              className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">YouTube Link</label>
            <input
              type="url"
              name="link"
              value={newEvent.link}
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
              value={newEvent.description}
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
            {editingId ? "Update Event" : "Add Event"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pastEvents.map((evt) => {
          const videoID = extractYouTubeID(evt.link);
          return (
            <div
              key={evt.id}
              className="p-4 border rounded bg-white dark:bg-gray-800 shadow flex flex-col"
            >
              <h2 className="text-lg font-bold mb-2">{evt.title}</h2>
              <div className="relative w-full h-0 pb-[56.25%] mb-2">
                {videoID && (
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded"
                    src={`https://www.youtube.com/embed/${videoID}`}
                    title={evt.title}
                    allowFullScreen
                  ></iframe>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-2 flex-grow">
                {evt.description}
              </p>
              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(evt.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(evt.id)}
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

export default PastEvents;
