import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

describe('Server', () => {
  let originalEnv;
  let consoleLogSpy;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
    // Spy on console.log
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    // Restore console.log
    consoleLogSpy.mockRestore();
    // Clear module cache
    jest.resetModules();
  });

  it('should start server and log message when NODE_ENV is not test', async () => {
    // Set NODE_ENV to test during import to prevent auto-start
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3001'; // Use different port to avoid conflicts

    // Clear module cache to force re-import
    jest.resetModules();

    // Import server module (won't start because NODE_ENV is 'test')
    const serverModule = await import('../../server.js');
    const server = serverModule.default;
    const { startServer } = serverModule;

    // Mock listen to prevent actual server start and capture callback synchronously
    const listenSpy = jest.spyOn(server, 'listen').mockImplementation((port, callback) => {
      // Execute callback immediately to test the log message
      if (callback) {
        callback();
      }
      return { close: jest.fn() };
    });

    // Change NODE_ENV to trigger server start
    delete process.env.NODE_ENV;
    
    // Call startServer - this should trigger listen
    startServer();
    
    // Verify listen was called (PORT from process.env is a string)
    expect(listenSpy).toHaveBeenCalled();
    const callArgs = listenSpy.mock.calls[0];
    expect(callArgs[0]).toBe('3001'); // PORT from process.env is a string
    expect(typeof callArgs[1]).toBe('function'); // Callback should be a function
    
    // Verify console.log was called with the startup message
    expect(consoleLogSpy).toHaveBeenCalledWith('Server is running on port 3001');
    
    // Restore
    process.env.NODE_ENV = 'test';
    listenSpy.mockRestore();
  });

  it('should not start server when NODE_ENV is test', async () => {
    // Set NODE_ENV to test
    process.env.NODE_ENV = 'test';
    
    // Clear module cache
    jest.resetModules();
    
    // Import server module
    const serverModule = await import('../../server.js');
    const server = serverModule.default;
    const { startServer } = serverModule;

    // Mock listen to verify it's not called
    const listenSpy = jest.spyOn(server, 'listen').mockImplementation(() => {
      return { close: jest.fn() };
    });

    // Call startServer - it should not call listen
    startServer();
    
    // Verify listen was NOT called
    expect(listenSpy).not.toHaveBeenCalled();
    // console.log should not have been called
    expect(consoleLogSpy).not.toHaveBeenCalled();
    
    listenSpy.mockRestore();
  });

  it('should use default PORT 3000 when PORT env variable is not set', async () => {
    // Set NODE_ENV to test during import to prevent auto-start
    process.env.NODE_ENV = 'test';
    // Explicitly set PORT to undefined/empty to test default value branch
    // This ensures the || 3000 fallback is tested
    delete process.env.PORT;
    // Also try setting to empty string to cover all falsy cases
    process.env.PORT = '';

    // Clear module cache to force re-import with PORT as empty string
    jest.resetModules();

    // Import server module - PORT will be evaluated as '' || 3000 = 3000
    const serverModule = await import('../../server.js');
    const server = serverModule.default;
    const { startServer } = serverModule;

    // Mock listen to prevent actual server start
    const listenSpy = jest.spyOn(server, 'listen').mockImplementation((port, callback) => {
      if (callback) {
        callback();
      }
      return { close: jest.fn() };
    });

    // Change NODE_ENV to trigger server start
    delete process.env.NODE_ENV;
    
    // Call startServer - should use default PORT 3000 (from empty string fallback)
    startServer();
    
    // Verify listen was called with default PORT 3000
    expect(listenSpy).toHaveBeenCalled();
    const callArgs = listenSpy.mock.calls[0];
    expect(callArgs[0]).toBe(3000); // Default PORT value from fallback
    expect(typeof callArgs[1]).toBe('function');
    
    // Verify console.log was called with default port
    expect(consoleLogSpy).toHaveBeenCalledWith('Server is running on port 3000');
    
    // Restore
    process.env.NODE_ENV = 'test';
    listenSpy.mockRestore();
  });

  it('should use default PORT 3000 when PORT env variable is undefined', async () => {
    // Set NODE_ENV to test during import to prevent auto-start
    process.env.NODE_ENV = 'test';
    // Explicitly remove PORT to test undefined case
    delete process.env.PORT;

    // Clear module cache to force re-import with PORT as undefined
    jest.resetModules();

    // Import server module - PORT will be evaluated as undefined || 3000 = 3000
    const serverModule = await import('../../server.js');
    const server = serverModule.default;
    const { startServer } = serverModule;

    // Mock listen to prevent actual server start
    const listenSpy = jest.spyOn(server, 'listen').mockImplementation((port, callback) => {
      if (callback) {
        callback();
      }
      return { close: jest.fn() };
    });

    // Change NODE_ENV to trigger server start
    delete process.env.NODE_ENV;
    
    // Call startServer - should use default PORT 3000 (from undefined fallback)
    startServer();
    
    // Verify listen was called with default PORT 3000
    expect(listenSpy).toHaveBeenCalled();
    const callArgs = listenSpy.mock.calls[0];
    expect(callArgs[0]).toBe(3000); // Default PORT value from undefined fallback
    expect(typeof callArgs[1]).toBe('function');
    
    // Verify console.log was called with default port
    expect(consoleLogSpy).toHaveBeenCalledWith('Server is running on port 3000');
    
    // Restore
    process.env.NODE_ENV = 'test';
    listenSpy.mockRestore();
  });

  it('should export Express app instance with correct methods', async () => {
    process.env.NODE_ENV = 'test';
    jest.resetModules();
    
    const serverModule = await import('../../server.js');
    const server = serverModule.default;

    // Verify it's an Express app
    expect(server).toBeDefined();
    expect(typeof server.get).toBe('function');
    expect(typeof server.use).toBe('function');
    expect(typeof server.listen).toBe('function');
  });
});

