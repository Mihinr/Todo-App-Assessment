import { describe, it, expect, beforeEach } from '@jest/globals';
import taskController from '../../controllers/taskController.js';
import taskService from '../../services/taskService.js';

describe('TaskController', () => {
  let req, res;

  beforeEach(() => {
    jest.restoreAllMocks();
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const mockTask = { id: 1, title: 'Test Task', description: 'Test Description' };
      jest.spyOn(taskService, 'createTask').mockResolvedValue(mockTask);
      req.body = { title: 'Test Task', description: 'Test Description' };

      await taskController.createTask(req, res);

      expect(taskService.createTask).toHaveBeenCalledWith('Test Task', 'Test Description');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTask
      });
    });

    it('should handle errors when creating a task', async () => {
      const error = new Error('Title is required');
      jest.spyOn(taskService, 'createTask').mockRejectedValue(error);
      req.body = { title: '', description: 'Test Description' };

      await taskController.createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Title is required'
      });
    });
  });

  describe('getRecentTasks', () => {
    it('should return recent tasks successfully', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', completed: false },
        { id: 2, title: 'Task 2', completed: false }
      ];
      const mockTotalCount = 5;
      jest.spyOn(taskService, 'getRecentTasks').mockResolvedValue({
        tasks: mockTasks,
        totalCount: mockTotalCount
      });

      await taskController.getRecentTasks(req, res);

      expect(taskService.getRecentTasks).toHaveBeenCalledWith(5);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTasks,
        totalCount: mockTotalCount
      });
    });

    it('should handle errors when getting recent tasks', async () => {
      const error = new Error('Database connection failed');
      jest.spyOn(taskService, 'getRecentTasks').mockRejectedValue(error);

      await taskController.getRecentTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Database connection failed'
      });
    });
  });

  describe('completeTask', () => {
    it('should complete a task successfully', async () => {
      const mockTask = { id: 1, title: 'Test Task', completed: true };
      jest.spyOn(taskService, 'completeTask').mockResolvedValue(mockTask);
      req.params = { id: '1' };

      await taskController.completeTask(req, res);

      expect(taskService.completeTask).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTask
      });
    });

    it('should handle 404 error when task not found', async () => {
      const error = new Error('Task not found');
      jest.spyOn(taskService, 'completeTask').mockRejectedValue(error);
      req.params = { id: '999' };

      await taskController.completeTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Task not found'
      });
    });

    it('should handle 400 error for other errors', async () => {
      const error = new Error('Invalid task ID');
      jest.spyOn(taskService, 'completeTask').mockRejectedValue(error);
      req.params = { id: 'invalid' };

      await taskController.completeTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid task ID'
      });
    });
  });
});

