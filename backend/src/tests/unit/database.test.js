import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";

// Mock dotenv to prevent loading .env file
jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

// Mock mysql2/promise to capture configuration
const mockCreatePool = jest.fn(() => ({})); // Return an empty object as pool

jest.mock("mysql2/promise", () => {
  const mockModule = {
    createPool: mockCreatePool,
  };
  return mockModule;
});

describe("Database Configuration", () => {
  let originalEnv;

  beforeEach(() => {
    // Save original environment variables
    originalEnv = { ...process.env };
    mockCreatePool.mockClear();
  });

  afterEach(() => {
    // Restore original environment variables
    process.env = originalEnv;
  });

  it("should use default values when environment variables are not set", async () => {
    // Clear database-related environment variables
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;
    delete process.env.DB_USER;
    delete process.env.DB_PASSWORD;
    delete process.env.DB_NAME;

    // Reset modules and re-import to trigger module evaluation with cleared env vars
    jest.resetModules();
    await import("../../config/database.js");

    // Verify createPool was called with default values
    expect(mockCreatePool).toHaveBeenCalledWith(
      expect.objectContaining({
        host: "localhost",
        port: 3306,
        user: "todo_user",
        password: "todo_password",
        database: "todo_db",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      })
    );
  });

  it("should use environment variables when they are set", async () => {
    // Set environment variables
    process.env.DB_HOST = "custom_host";
    process.env.DB_PORT = "3307";
    process.env.DB_USER = "custom_user";
    process.env.DB_PASSWORD = "custom_password";
    process.env.DB_NAME = "custom_db";

    // Reset modules and re-import to trigger module evaluation with set env vars
    jest.resetModules();
    await import("../../config/database.js");

    // Verify createPool was called with environment variable values
    expect(mockCreatePool).toHaveBeenCalledWith(
      expect.objectContaining({
        host: "custom_host",
        port: "3307",
        user: "custom_user",
        password: "custom_password",
        database: "custom_db",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      })
    );
  });
});
