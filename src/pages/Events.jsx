import React, { useState, useEffect } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { db, storage } from "../config/firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  ref as databaseRef,
  push,
  update,
  remove,
  onValue,
} from "firebase/database";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    thumbnail: "",
    thumbnailType: "url", // "url" or "file"
    theme: "",
    date: "",
    modelType: "",
    location: "",
    modelsCount: "",
    software: "",
    enrollment: "",
    prizes: "",
    inspirations: [
      { image: "", imageType: "url", url: "" },
      { image: "", imageType: "url", url: "" },
      { image: "", imageType: "url", url: "" },
      { image: "", imageType: "url", url: "" },
    ],
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
  const eventsRef = databaseRef(db, "krafts/events");
  onValue(eventsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const fetchedEvents = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setEvents(fetchedEvents);
    } else {
      setEvents([]);
    }
  });
}, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setNewEvent({ ...newEvent, [field]: file });
    }
  };

  const handleInspirationChange = (index, field, value) => {
    const inspirations = [...newEvent.inspirations];
    inspirations[index][field] = value;
    setNewEvent({ ...newEvent, inspirations });
  };

  const uploadFile = async (file, folder) => {
  const fileRef = storageRef(storage, `krafts/${folder}/${file.name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};


  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    let thumbnailUrl = newEvent.thumbnail;
    if (newEvent.thumbnailType === "file" && newEvent.thumbnail) {
      thumbnailUrl = await uploadFile(newEvent.thumbnail, "krafts/events/thumbnails");
    }

    const inspirations = await Promise.all(
      newEvent.inspirations.map(async (insp) => {
        if (insp.imageType === "file" && insp.image) {
          const imageUrl = await uploadFile(insp.image, "krafts/events/inspirations");
          return { ...insp, image: imageUrl };
        }
        return insp;
      })
    );

    const eventData = {
      ...newEvent,
      thumbnail: thumbnailUrl,
      inspirations,
    };

    if (editingId) {
      const eventRef = databaseRef(db, `krafts/events/${editingId}`);
      await update(eventRef, eventData);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === editingId ? { ...eventData, id: editingId } : event
        )
      );
      setEditingId(null);
    } else {
      const newEventRef = databaseRef(db, "krafts/events");
      const newEventKey = push(newEventRef).key;
      await update(databaseRef(db, `krafts/events/${newEventKey}`), eventData);
      setEvents([...events, { ...eventData, id: newEventKey }]);
    }

    resetForm();
  } catch (error) {
    console.error("Error saving event:", error);
  } finally {
    setLoading(false);
  }
};


  const handleEdit = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setNewEvent(event);
      setEditingId(eventId);
      setIsFormVisible(true);
    }
  };

  const handleDelete = async (eventId) => {
  try {
    await remove(databaseRef(db, `krafts/events/${eventId}`));
    setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};


  const resetForm = () => {
    setNewEvent({
      title: "",
      thumbnail: "",
      thumbnailType: "url",
      theme: "",
      date: "",
      modelType: "",
      location: "",
      modelsCount: "",
      software: "",
      enrollment: "",
      prizes: "",
      inspirations: [
        { image: "", imageType: "url", url: "" },
        { image: "", imageType: "url", url: "" },
        { image: "", imageType: "url", url: "" },
        { image: "", imageType: "url", url: "" },
      ],
    });
    setEditingId(null);
    setIsFormVisible(false);
  };

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Manage Events</h1>
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
      {isFormVisible && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 border rounded bg-gray-100 dark:bg-gray-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block font-semibold mb-1">Theme</label>
              <input
                type="text"
                name="theme"
                value={newEvent.theme}
                onChange={handleChange}
                placeholder="Event Theme"
                className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Location</label>
              <input
                type="url"
                name="location"
                value={newEvent.location}
                onChange={handleChange}
                placeholder="Location URL"
                className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Model Type</label>
              <input
                type="text"
                name="modelType"
                value={newEvent.modelType}
                onChange={handleChange}
                placeholder="Model Type"
                className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Models Count</label>
              <input
                type="text"
                name="modelsCount"
                value={newEvent.modelsCount}
                onChange={handleChange}
                placeholder="Number of Models"
                className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Software</label>
              <input
                type="text"
                name="software"
                value={newEvent.software}
                onChange={handleChange}
                placeholder="Software Used"
                className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Enrollment</label>
              <input
                type="text"
                name="enrollment"
                value={newEvent.enrollment}
                onChange={handleChange}
                placeholder="Enrollment Details"
                className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Prizes</label>
              <input
                type="text"
                name="prizes"
                value={newEvent.prizes}
                onChange={handleChange}
                placeholder="Prize Details"
                className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Thumbnail</label>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="thumbnailType"
                value="url"
                checked={newEvent.thumbnailType === "url"}
                onChange={handleChange}
              />
              <span>URL</span>
              <input
                type="radio"
                name="thumbnailType"
                value="file"
                checked={newEvent.thumbnailType === "file"}
                onChange={handleChange}
              />
              <span>File</span>
            </div>
            {newEvent.thumbnailType === "url" ? (
              <input
                type="url"
                name="thumbnail"
                value={newEvent.thumbnail}
                onChange={handleChange}
                placeholder="Thumbnail URL"
                className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            ) : (
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "thumbnail")}
                className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                required
              />
            )}
          </div>

          <div className="mt-4">
            <label className="block font-semibold mb-1">Inspirations</label>
            {newEvent.inspirations.map((insp, index) => (
              <div key={index} className="mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name={`inspirationType${index}`}
                    value="url"
                    checked={insp.imageType === "url"}
                    onChange={(e) =>
                      handleInspirationChange(index, "imageType", e.target.value)
                    }
                  />
                  <span>URL</span>
                  <input
                    type="radio"
                    name={`inspirationType${index}`}
                    value="file"
                    checked={insp.imageType === "file"}
                    onChange={(e) =>
                      handleInspirationChange(index, "imageType", e.target.value)
                    }
                  />
                  <span>File</span>
                </div>
                {insp.imageType === "url" ? (
                  <input
                    type="url"
                    value={insp.image}
                    onChange={(e) =>
                      handleInspirationChange(index, "image", e.target.value)
                    }
                    placeholder="Inspiration Image URL"
                    className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                    required
                  />
                ) : (
                  <input
                    type="file"
                    onChange={(e) =>
                      handleInspirationChange(index, "image", e.target.files[0])
                    }
                    className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                    required
                  />
                )}
                <input
                  type="url"
                  value={insp.url}
                  onChange={(e) =>
                    handleInspirationChange(index, "url", e.target.value)
                  }
                  placeholder="Inspiration Link"
                  className="w-full border rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200 mt-2"
                  required
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className={`mt-4 px-4 py-2 rounded text-white ${
              loading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={loading}
          >
            {loading ? "Loading..." : editingId ? "Update Event" : "Create Event"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 border rounded bg-white dark:bg-gray-800 shadow"
          >
            <div className="flex items-start gap-4">
              <img
                src={event.thumbnail}
                alt="Thumbnail"
                className="w-20 h-20 rounded"
              />
              <div>
                <h2 className="text-lg font-bold">{event.title}</h2>
                <p>{event.date}</p>
                <button
                  onClick={() => handleEdit(event.id)}
                  className="mt-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="mt-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
