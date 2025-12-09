import { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-indigo-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
              <h1 className="text-4xl font-bold mb-1">Todo Application</h1>
            </div>
          </div>
          <p className="text-gray-700 text-lg font-medium">Manage your tasks efficiently and beautifully</p>
        </header>

        <main>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
              <TaskForm onTaskCreated={handleTaskCreated} />
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
              <TaskList refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
