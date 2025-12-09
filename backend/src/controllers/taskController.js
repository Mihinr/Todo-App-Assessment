import taskService from '../services/taskService.js';

class TaskController {
  async createTask(req, res) {
    try {
      const { title, description } = req.body;
      const task = await taskService.createTask(title, description);
      res.status(201).json({
        success: true,
        data: task
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getRecentTasks(req, res) {
    try {
      const { tasks, totalCount } = await taskService.getRecentTasks(5);
      res.status(200).json({
        success: true,
        data: tasks,
        totalCount: totalCount
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async completeTask(req, res) {
    try {
      const { id } = req.params;
      const task = await taskService.completeTask(parseInt(id));
      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      const statusCode = error.message === 'Task not found' ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new TaskController();

