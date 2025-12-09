import Task from '../models/Task.js';

class TaskService {
  async createTask(title, description) {
    if (!title || title.trim().length === 0) {
      throw new Error('Title is required');
    }
    
    if (title.length > 255) {
      throw new Error('Title must be less than 255 characters');
    }

    return await Task.create(title, description || '');
  }

  async getRecentTasks(limit = 5) {
    const tasks = await Task.findRecent(limit);
    const totalCount = await Task.countIncomplete();
    return { tasks, totalCount };
  }

  async completeTask(id) {
    const task = await Task.findById(id);
    
    if (!task) {
      throw new Error('Task not found');
    }

    if (task.completed) {
      throw new Error('Task is already completed');
    }

    return await Task.markAsCompleted(id);
  }
}

export default new TaskService();

