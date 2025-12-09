import { describe, it, expect, beforeEach } from '@jest/globals';
import taskService from '../../services/taskService.js';
import * as TaskModule from '../../models/Task.js';

const Task = TaskModule.default;

describe('TaskService', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('createTask', () => {
    it('should create a task with valid title and description', async () => {
      const mockTaskData = { id: 1, title: 'Test Task', description: 'Test Description' };
      jest.spyOn(Task, 'create').mockResolvedValue(mockTaskData);

      const result = await taskService.createTask('Test Task', 'Test Description');

      expect(Task.create).toHaveBeenCalledWith('Test Task', 'Test Description');
      expect(result).toEqual(mockTaskData);
    });

    it('should create a task with null description (defaults to empty string)', async () => {
      const mockTaskData = { id: 1, title: 'Test Task', description: '' };
      jest.spyOn(Task, 'create').mockResolvedValue(mockTaskData);

      const result = await taskService.createTask('Test Task', null);

      expect(Task.create).toHaveBeenCalledWith('Test Task', '');
      expect(result).toEqual(mockTaskData);
    });

    it('should create a task with undefined description (defaults to empty string)', async () => {
      const mockTaskData = { id: 1, title: 'Test Task', description: '' };
      jest.spyOn(Task, 'create').mockResolvedValue(mockTaskData);

      const result = await taskService.createTask('Test Task', undefined);

      expect(Task.create).toHaveBeenCalledWith('Test Task', '');
      expect(result).toEqual(mockTaskData);
    });

    it('should throw error when title is empty', async () => {
      await expect(taskService.createTask('', 'Description')).rejects.toThrow('Title is required');
    });

    it('should throw error when title is too long', async () => {
      const longTitle = 'a'.repeat(256);
      await expect(taskService.createTask(longTitle, 'Description')).rejects.toThrow('Title must be less than 255 characters');
    });
  });

  describe('getRecentTasks', () => {
    it('should return recent tasks with default limit when no limit provided', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', completed: false },
        { id: 2, title: 'Task 2', completed: false },
      ];
      const mockTotalCount = 10;
      jest.spyOn(Task, 'findRecent').mockResolvedValue(mockTasks);
      jest.spyOn(Task, 'countIncomplete').mockResolvedValue(mockTotalCount);

      const result = await taskService.getRecentTasks();

      expect(Task.findRecent).toHaveBeenCalledWith(5);
      expect(Task.countIncomplete).toHaveBeenCalled();
      expect(result).toEqual({ tasks: mockTasks, totalCount: mockTotalCount });
    });

    it('should return recent tasks with total count', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', completed: false },
        { id: 2, title: 'Task 2', completed: false },
      ];
      const mockTotalCount = 10;
      jest.spyOn(Task, 'findRecent').mockResolvedValue(mockTasks);
      jest.spyOn(Task, 'countIncomplete').mockResolvedValue(mockTotalCount);

      const result = await taskService.getRecentTasks(5);

      expect(Task.findRecent).toHaveBeenCalledWith(5);
      expect(Task.countIncomplete).toHaveBeenCalled();
      expect(result).toEqual({ tasks: mockTasks, totalCount: mockTotalCount });
    });

    it('should return empty tasks array and zero count when no tasks exist', async () => {
      jest.spyOn(Task, 'findRecent').mockResolvedValue([]);
      jest.spyOn(Task, 'countIncomplete').mockResolvedValue(0);

      const result = await taskService.getRecentTasks(5);

      expect(result).toEqual({ tasks: [], totalCount: 0 });
    });
  });

  describe('completeTask', () => {
    it('should complete a task successfully', async () => {
      const mockTask = { id: 1, title: 'Test Task', completed: false };
      const completedTask = { id: 1, title: 'Test Task', completed: true };
      
      jest.spyOn(Task, 'findById').mockResolvedValue(mockTask);
      jest.spyOn(Task, 'markAsCompleted').mockResolvedValue(completedTask);

      const result = await taskService.completeTask(1);

      expect(Task.findById).toHaveBeenCalledWith(1);
      expect(Task.markAsCompleted).toHaveBeenCalledWith(1);
      expect(result).toEqual(completedTask);
    });

    it('should throw error when task not found', async () => {
      jest.spyOn(Task, 'findById').mockResolvedValue(null);

      await expect(taskService.completeTask(999)).rejects.toThrow('Task not found');
    });

    it('should throw error when task is already completed', async () => {
      const completedTask = { id: 1, title: 'Test Task', completed: true };
      jest.spyOn(Task, 'findById').mockResolvedValue(completedTask);

      await expect(taskService.completeTask(1)).rejects.toThrow('Task is already completed');
    });
  });
});

