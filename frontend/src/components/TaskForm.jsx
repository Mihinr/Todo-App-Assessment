import { useState } from "react";
import { taskAPI } from "../services/api";

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await taskAPI.createTask(title.trim(), description.trim());
      setTitle("");
      setDescription("");
      onTaskCreated();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to create task"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 h-fit transition-all duration-300 hover:shadow-2xl"
    >
      <div className="flex items-center mb-6">
        <div className="bg-indigo-500 w-1 h-8 rounded-full mr-3"></div>
        <h2 className="text-3xl font-bold text-indigo-600">Create New Task</h2>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-md animate-pulse">
          <div className="flex items-center">
            <span className="mr-2">⚠️</span>
            <span className="font-semibold">{error}</span>
          </div>
        </div>
      )}

      <div className="mb-6">
        <label
          htmlFor="title"
          className="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide"
        >
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/50 shadow-sm hover:shadow-md"
          placeholder="Enter task title"
          required
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="description"
          className="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white/50 shadow-sm hover:shadow-md resize-none"
          rows="4"
          placeholder="Enter task description (optional)"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <span className="animate-spin mr-2">⏳</span>
            Creating...
          </span>
        ) : (
          <span className="flex items-center justify-center">Create Task</span>
        )}
      </button>
    </form>
  );
};

export default TaskForm;
