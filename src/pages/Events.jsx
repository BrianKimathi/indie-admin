import React, { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const Events = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Game Tournament 2024",
      image: "https://via.placeholder.com/150",
      description: "Join our annual game tournament!",
      discordLink: "https://discord.gg/example",
      venueLink: "https://example.com/venue",
      time: "2024-09-15 18:00",
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    image: "",
    description: "",
    discordLink: "",
    venueLink: "",
    time: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggles the form visibility

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  // Add or Update Event
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setEvents(
        events.map((event) =>
          event.id === editingId ? { ...newEvent, id: editingId } : event
        )
      );
      setEditingId(null);
    } else {
      setEvents([...events, { ...newEvent, id: Date.now() }]);
    }

    // Reset Form
    setNewEvent({
      title: "",
      image: "",
      description: "",
      discordLink: "",
      venueLink: "",
      time: "",
    });
    setIsFormVisible(false);
  };

  // Edit Event
  const handleEdit = (id) => {
    const event = events.find((event) => event.id === id);
    setNewEvent(event);
    setEditingId(id);
    setIsFormVisible(true);
  };

  // Delete Event
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Manage Events</h1>

      {/* Toggle Form Visibility */}
      <div
        className="flex items-center justify-between cursor-pointer bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded mb-4"
        onClick={() => setIsFormVisible(!isFormVisible)}
      >
        <h2 className="text-lg font-bold">
          {editingId ? "Edit Event" : "Create Event"}
        </h2>
        {isFormVisible ? (
          <ChevronUpIcon className="w-6 h-6" />
        ) : (
          <ChevronDownIcon className="w-6 h-6" />
        )}
      </div>

      {/* Event Form */}
      {isFormVisible && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 border rounded bg-gray-100 dark:bg-gray-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
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

            {/* Image Link */}
            <div>
              <label className="block font-semibold mb-1">Image URL</label>
              <input
                type="url"
                name="image"
                value={newEvent.image}
                onChange={handleChange}
                placeholder="Image Link"
                className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleChange}
                placeholder="Event Description"
                rows="3"
                className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                required
              ></textarea>
            </div>

            {/* Discord Link */}
            <div>
              <label className="block font-semibold mb-1">Discord Link</label>
              <input
                type="url"
                name="discordLink"
                value={newEvent.discordLink}
                onChange={handleChange}
                placeholder="Discord Link"
                className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>

            {/* Venue Link */}
            <div>
              <label className="block font-semibold mb-1">Venue Link</label>
              <input
                type="url"
                name="venueLink"
                value={newEvent.venueLink}
                onChange={handleChange}
                placeholder="Online Venue Link"
                className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>

            {/* Time */}
            <div>
              <label className="block font-semibold mb-1">Time</label>
              <input
                type="datetime-local"
                name="time"
                value={newEvent.time}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingId ? "Update Event" : "Create Event"}
          </button>
        </form>
      )}

      {/* Event List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No events created yet.</p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="p-4 border rounded bg-white dark:bg-gray-800 shadow flex flex-col md:flex-row justify-between items-start"
            >
              <div>
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full md:w-32 h-20 object-cover rounded mb-2"
                />
                <h2 className="text-lg font-bold">{event.title}</h2>
                <p>{event.description}</p>
                <p>
                  <a
                    href={event.discordLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Discord Link
                  </a>{" "}
                  |{" "}
                  <a
                    href={event.venueLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Venue Link
                  </a>
                </p>
                <p className="text-gray-500 dark:text-gray-400">Time: {event.time}</p>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  onClick={() => handleEdit(event.id)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
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

export default Events;
