import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '../components/TaskCard';
import { taskAPI } from '../services/api';

vi.mock('../services/api');

describe('TaskCard', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    created_at: '2024-01-01T12:00:00.000Z'
  };

  const mockOnTaskCompleted = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders task title and description', () => {
    render(<TaskCard task={mockTask} onTaskCompleted={mockOnTaskCompleted} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders task without description when description is missing', () => {
    const taskWithoutDescription = { ...mockTask, description: null };
    render(<TaskCard task={taskWithoutDescription} onTaskCompleted={mockOnTaskCompleted} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('displays formatted date', () => {
    render(<TaskCard task={mockTask} onTaskCompleted={mockOnTaskCompleted} />);
    
    const dateElement = screen.getByText(/Jan 1/i);
    expect(dateElement).toBeInTheDocument();
  });

  it('calls onTaskCompleted when Done button is clicked', async () => {
    const user = userEvent.setup();
    taskAPI.completeTask = vi.fn().mockResolvedValue({ success: true });

    render(<TaskCard task={mockTask} onTaskCompleted={mockOnTaskCompleted} />);
    
    const doneButton = screen.getByRole('button', { name: /done/i });
    await user.click(doneButton);

    await waitFor(() => {
      expect(taskAPI.completeTask).toHaveBeenCalledWith(1);
      expect(mockOnTaskCompleted).toHaveBeenCalledTimes(1);
    });
  });

  it('handles error when completing task fails', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    taskAPI.completeTask = vi.fn().mockRejectedValue(new Error('API Error'));

    render(<TaskCard task={mockTask} onTaskCompleted={mockOnTaskCompleted} />);
    
    const doneButton = screen.getByRole('button', { name: /done/i });
    await user.click(doneButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('Failed to complete task. Please try again.');
    });

    consoleErrorSpy.mockRestore();
    alertSpy.mockRestore();
  });
});

