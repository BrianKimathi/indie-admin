import React from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  // Example data for stats
  const stats = {
    totalEvents: 12,
    totalInspirations: 8,
    totalUsers: 24,
  };

  // Chart Data for Bar Graph (Event Stats)
  const eventData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Events Created",
        data: [2, 3, 5, 1, 4],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart Data for Pie Chart (User Roles)
  const userRolesData = {
    labels: ["Admin", "Editor", "Viewer"],
    datasets: [
      {
        label: "User Roles",
        data: [1, 5, 18],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  // Chart Data for Line Graph (Inspirations Added Over Time)
  const inspirationData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Inspirations Added",
        data: [1, 2, 3, 2],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        fill: true,
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
          <h2 className="text-xl font-bold">Total Events</h2>
          <p className="text-3xl">{stats.totalEvents}</p>
        </div>
        <div className="p-4 rounded-lg text-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
          <h2 className="text-xl font-bold">Total Inspirations</h2>
          <p className="text-3xl">{stats.totalInspirations}</p>
        </div>
        <div className="p-4 rounded-lg text-center bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-3xl">{stats.totalUsers}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Events Bar Chart */}
        <div className="p-4 border rounded-lg shadow bg-white dark:bg-gray-800 dark:text-gray-200">
          <h2 className="text-xl font-bold mb-4">Events Created Over Months</h2>
          <Bar data={eventData} options={{ responsive: true }} />
        </div>

        {/* User Roles Pie Chart */}
        <div className="p-4 border rounded-lg shadow bg-white dark:bg-gray-800 dark:text-gray-200">
          <h2 className="text-xl font-bold mb-4">User Roles Distribution</h2>
          <Pie data={userRolesData} options={{ responsive: true }} />
        </div>

        {/* Inspirations Line Graph */}
        <div className="md:col-span-2 p-4 border rounded-lg shadow bg-white dark:bg-gray-800 dark:text-gray-200">
          <h2 className="text-xl font-bold mb-4">Inspirations Added Weekly</h2>
          <Line data={inspirationData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
