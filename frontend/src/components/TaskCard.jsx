import { taskAPI } from '../services/api';

const TaskCard = ({ task, onTaskCompleted }) => {
  const handleComplete = async () => {
    try {
      await taskAPI.completeTask(task.id);
      onTaskCompleted();
    } catch (error) {
      console.error('Error completing task:', error);
      alert('Failed to complete task. Please try again.');
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl border-l-4 border-indigo-500 transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <div className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></div>
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">
              {task.title}
            </h3>
          </div>
          {task.description && (
            <p className="text-gray-600 text-sm mb-3 ml-5 leading-relaxed">
              {task.description}
            </p>
          )}
          <div className="ml-5 flex items-center gap-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              🕒 {new Date(task.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
        <button
          onClick={handleComplete}
          className="ml-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-5 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-md hover:shadow-lg flex-shrink-0"
        >
          <span className="flex items-center gap-1.5">
            <span>✓</span>
            <span>Done</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;

