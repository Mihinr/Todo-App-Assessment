import { describe, it, expect, beforeEach } from "@jest/globals";
import Task from "../../models/Task.js";
import * as dbModule from "../../config/database.js";

const db = dbModule.default;

describe("Task Model", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("create", () => {
    it("should create a new task and return it", async () => {
      const mockInsertResult = { insertId: 1 };
      const mockTask = {
        id: 1,
        title: "Test Task",
        description: "Test Description",
        completed: false,
      };

      jest
        .spyOn(db, "execute")
        .mockResolvedValueOnce([mockInsertResult])
        .mockResolvedValueOnce([[mockTask]]);

      const result = await Task.create("Test Task", "Test Description");

      expect(db.execute).toHaveBeenCalledWith(
        "INSERT INTO task (title, description) VALUES (?, ?)",
        ["Test Task", "Test Description"]
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe("findById", () => {
    it("should return task when found", async () => {
      const mockTask = { id: 1, title: "Test Task", completed: false };
      jest.spyOn(db, "execute").mockResolvedValue([[mockTask]]);

      const result = await Task.findById(1);

      expect(db.execute).toHaveBeenCalledWith(
        "SELECT * FROM task WHERE id = ?",
        [1]
      );
      expect(result).toEqual(mockTask);
    });

    it("should return null when task not found", async () => {
      db.execute = jest.fn().mockResolvedValue([[]]);

      const result = await Task.findById(999);

      expect(result).toBeNull();
    });
  });

  describe("findRecent", () => {
    it("should return recent incomplete tasks with default limit when no limit provided", async () => {
      const mockTasks = [
        { id: 1, title: "Task 1", completed: false },
        { id: 2, title: "Task 2", completed: false },
      ];
      db.execute = jest.fn().mockResolvedValue([mockTasks]);

      const result = await Task.findRecent();

      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM task"),
        []
      );
      expect(result).toEqual(mockTasks);
    });

    it("should return recent incomplete tasks with limit", async () => {
      const mockTasks = [
        { id: 1, title: "Task 1", completed: false },
        { id: 2, title: "Task 2", completed: false },
      ];
      db.execute = jest.fn().mockResolvedValue([mockTasks]);

      const result = await Task.findRecent(5);

      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM task"),
        []
      );
      expect(result).toEqual(mockTasks);
    });

    it("should throw error for invalid limit", async () => {
      await expect(Task.findRecent(0)).rejects.toThrow(
        "Limit must be a positive integer"
      );
      await expect(Task.findRecent(-1)).rejects.toThrow(
        "Limit must be a positive integer"
      );
      await expect(Task.findRecent("invalid")).rejects.toThrow(
        "Limit must be a positive integer"
      );
    });
  });

  describe("markAsCompleted", () => {
    it("should mark task as completed and return updated task", async () => {
      const mockCompletedTask = { id: 1, title: "Test Task", completed: true };
      db.execute = jest
        .fn()
        .mockResolvedValueOnce([[]]) // UPDATE query
        .mockResolvedValueOnce([[mockCompletedTask]]); // findById query

      const result = await Task.markAsCompleted(1);

      expect(db.execute).toHaveBeenCalledWith(
        "UPDATE task SET completed = TRUE WHERE id = ?",
        [1]
      );
      expect(result).toEqual(mockCompletedTask);
    });
  });

  describe("findAll", () => {
    it("should return all tasks ordered by created_at DESC", async () => {
      const mockTasks = [
        { id: 1, title: "Task 1", completed: false, created_at: "2024-01-02" },
        { id: 2, title: "Task 2", completed: true, created_at: "2024-01-01" },
      ];
      db.execute = jest.fn().mockResolvedValue([mockTasks]);

      const result = await Task.findAll();

      expect(db.execute).toHaveBeenCalledWith(
        "SELECT * FROM task ORDER BY created_at DESC"
      );
      expect(result).toEqual(mockTasks);
    });

    it("should return empty array when no tasks exist", async () => {
      db.execute = jest.fn().mockResolvedValue([[]]);

      const result = await Task.findAll();

      expect(result).toEqual([]);
    });
  });

  describe("countIncomplete", () => {
    it("should return count of incomplete tasks", async () => {
      db.execute = jest.fn().mockResolvedValue([[{ count: 5 }]]);

      const result = await Task.countIncomplete();

      expect(db.execute).toHaveBeenCalledWith(
        "SELECT COUNT(*) as count FROM task WHERE completed = FALSE"
      );
      expect(result).toBe(5);
    });

    it("should return 0 when no incomplete tasks exist", async () => {
      db.execute = jest.fn().mockResolvedValue([[{ count: 0 }]]);

      const result = await Task.countIncomplete();

      expect(result).toBe(0);
    });

    it("should handle string count and convert to number", async () => {
      db.execute = jest.fn().mockResolvedValue([[{ count: "10" }]]);

      const result = await Task.countIncomplete();

      expect(result).toBe(10);
    });
  });
});
