import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tasks"); // Update with actual backend URL
        setTasks(response.data); // Store tasks in state
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
      }
    };

    fetchTasks();
  }, []);

  // Delete a task
  const handleDelete = async (taskId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);

      if (response.status === 200) {
        setTasks(tasks.filter((task) => task._id !== taskId));
      }
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  // Mark task as completed
  const handleComplete = async (taskId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/tasks/${taskId}`, {
        status: "Completed",
      });

      if (response.status === 200) {
        setTasks(tasks.map(task => 
          task._id === taskId ? { ...task, status: "Completed" } : task
        ));
      }
    } catch (error) {
      console.error("Error marking task as completed:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <Link to="/tasks/create">
          <button className="px-4 py-2 bg-green-500 rounded-md hover:bg-green-600">
            Add Task
          </button>
        </Link>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Task Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Total Tasks</h2>
            <p className="text-2xl">{tasks.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Pending Tasks</h2>
            <p className="text-2xl">{tasks.filter(task => task.status === "Pending").length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Completed Tasks</h2>
            <p className="text-2xl">{tasks.filter(task => task.status === "Completed").length}</p>
          </div>
        </div>

        {/* Task List */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="p-4 text-left">Task</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td className="p-4">{task.title}</td>
                  <td className="p-4">{task.status}</td>
                  <td className="p-4">
                    <Link to={`/tasks/edit/${task._id}`}>
                      <button className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                        Edit
                      </button>
                    </Link>
                    <button
                      className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>

                    {/* Mark as Completed Button */}
                    {task.status !== "Completed" && (
                      <button
                        className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        onClick={() => handleComplete(task._id)}
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
