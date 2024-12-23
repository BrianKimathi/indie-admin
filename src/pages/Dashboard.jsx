import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import { ref, onValue } from "firebase/database";
import { db } from "../config/firebase";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFeatures: 0,
    totalEvents: 0,
    totalPastEvents: 0,
  });

  const [eventData, setEventData] = useState([]);
  const [pastEventData, setPastEventData] = useState([]);

  useEffect(() => {
    // Fetch features count
    const featuresRef = ref(db, "features/");
    onValue(featuresRef, (snapshot) => {
      const data = snapshot.val();
      const totalFeatures = data ? Object.keys(data).length : 0;
      setStats((prevStats) => ({ ...prevStats, totalFeatures }));
    });

    // Fetch events count and data for charts
    const eventsRef = ref(db, "events/");
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      const totalEvents = data ? Object.keys(data).length : 0;
      setEventData(data ? Object.values(data) : []);
      setStats((prevStats) => ({ ...prevStats, totalEvents }));
    });

    // Fetch past events count and data for charts
    const pastEventsRef = ref(db, "pastEvents/");
    onValue(pastEventsRef, (snapshot) => {
      const data = snapshot.val();
      const totalPastEvents = data ? Object.keys(data).length : 0;
      setPastEventData(data ? Object.values(data) : []);
      setStats((prevStats) => ({ ...prevStats, totalPastEvents }));
    });
  }, []);

  // Prepare data for charts
  const eventChartData = {
    labels: eventData.map((_, index) => `Event ${index + 1}`),
    datasets: [
      {
        label: "Events Created",
        data: eventData.map((event) => event.modelsCount || 1), // Example stat
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pastEventChartData = {
    labels: pastEventData.map((_, index) => `Past Event ${index + 1}`),
    datasets: [
      {
        label: "Past Events Added",
        data: pastEventData.map((event, index) => index + 1), // Example stat
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Admin Dashboard
      </h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 rounded-lg text-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
          <h2 className="text-xl font-bold">Total Features</h2>
          <p className="text-3xl">{stats.totalFeatures}</p>
        </div>
        <div className="p-4 rounded-lg text-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
          <h2 className="text-xl font-bold">Total Events</h2>
          <p className="text-3xl">{stats.totalEvents}</p>
        </div>
        <div className="p-4 rounded-lg text-center bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
          <h2 className="text-xl font-bold">Total Past Events</h2>
          <p className="text-3xl">{stats.totalPastEvents}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Events Bar Chart */}
        <div className="p-4 border rounded-lg shadow bg-white dark:bg-gray-800 dark:text-gray-200">
          <h2 className="text-xl font-bold mb-4">Events Overview</h2>
          <Bar data={eventChartData} options={{ responsive: true }} />
        </div>

        {/* Past Events Line Chart */}
        <div className="p-4 border rounded-lg shadow bg-white dark:bg-gray-800 dark:text-gray-200">
          <h2 className="text-xl font-bold mb-4">Past Events Overview</h2>
          <Line data={pastEventChartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
