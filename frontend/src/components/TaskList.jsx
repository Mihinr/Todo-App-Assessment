import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import { taskAPI } from "../services/api";

const TaskList = ({ refreshTrigger }) => {
  const [tasks, setTasks] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getRecentTasks();
      setTasks(response.data || []);
      setTotalCount(response.totalCount || 0);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch tasks"
      );
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-indigo-500 w-1 h-8 rounded-full mr-3"></div>
            <h2 className="text-3xl font-bold text-indigo-600">Recent Tasks</h2>
          </div>
          <div className="bg-indigo-100 px-4 py-1 rounded-full">
            <span className="text-sm font-semibold text-indigo-700">
              Loading...
            </span>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-gray-600 font-medium">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-indigo-500 w-1 h-8 rounded-full mr-3"></div>
            <h2 className="text-3xl font-bold text-indigo-600">Recent Tasks</h2>
          </div>
          <div className="bg-indigo-100 px-4 py-1 rounded-full">
            <span className="text-sm font-semibold text-indigo-700">
              {totalCount} {totalCount === 1 ? "task" : "tasks"}
            </span>
          </div>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg shadow-md">
          <div className="flex items-center">
            <span className="mr-2">⚠️</span>
            <span className="font-semibold">Error: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-indigo-500 w-1 h-8 rounded-full mr-3"></div>
            <h2 className="text-3xl font-bold text-indigo-600">Recent Tasks</h2>
          </div>
          <div className="bg-indigo-100 px-4 py-1 rounded-full">
            <span className="text-sm font-semibold text-indigo-700">
              {totalCount} {totalCount === 1 ? "task" : "tasks"}
            </span>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4 animate-bounce">📝</div>
          <p className="text-gray-600 font-medium text-lg">
            No tasks available. Create your first task!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-indigo-500 w-1 h-8 rounded-full mr-3"></div>
          <h2 className="text-3xl font-bold text-indigo-600">Recent Tasks</h2>
        </div>
        <div className="bg-indigo-100 px-4 py-1 rounded-full">
          <span className="text-sm font-semibold text-indigo-700">
            {totalCount} {totalCount === 1 ? "task" : "tasks"}
          </span>
        </div>
      </div>
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <TaskCard task={task} onTaskCompleted={fetchTasks} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
