import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../components/TaskForm';
import { taskAPI } from '../services/api';

vi.mock('../services/api');

describe('TaskForm', () => {
  const mockOnTaskCreated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  it('allows user to type in title and description fields', async () => {
    const user = userEvent.setup();
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await user.type(titleInput, 'My Task');
    await user.type(descriptionInput, 'My Description');

    expect(titleInput).toHaveValue('My Task');
    expect(descriptionInput).toHaveValue('My Description');
  });

  it('shows error when title is empty and form is submitted', async () => {
    const user = userEvent.setup();
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);
    
    const form = screen.getByRole('button', { name: /create task/i }).closest('form');
    const titleInput = screen.getByLabelText(/title/i);
    
    // Remove required attribute to test our JavaScript validation
    titleInput.removeAttribute('required');
    
    // Submit form programmatically to bypass HTML5 validation
    await act(async () => {
      form.requestSubmit();
    });

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });

    expect(mockOnTaskCreated).not.toHaveBeenCalled();
  });

  it('shows error when title is only whitespace', async () => {
    const user = userEvent.setup();
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, '   ');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it('calls onTaskCreated after successful submission', async () => {
    const user = userEvent.setup();
    taskAPI.createTask = vi.fn().mockResolvedValue({
      success: true,
      data: { id: 1, title: 'Test Task', description: 'Test Description' }
    });

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, 'Test Description');
    await user.click(submitButton);

    await waitFor(() => {
      expect(taskAPI.createTask).toHaveBeenCalledWith('Test Task', 'Test Description');
      expect(mockOnTaskCreated).toHaveBeenCalledTimes(1);
    });

    // Form should be cleared after successful submission
    expect(titleInput).toHaveValue('');
    expect(descriptionInput).toHaveValue('');
  });

  it('clears form fields after successful submission', async () => {
    const user = userEvent.setup();
    taskAPI.createTask = vi.fn().mockResolvedValue({
      success: true,
      data: { id: 1, title: 'Test Task', description: '' }
    });

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, 'Test Description');
    await user.click(submitButton);

    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });
  });

  it('displays error message when API call fails with response data', async () => {
    const user = userEvent.setup();
    taskAPI.createTask = vi.fn().mockRejectedValue({
      response: { data: { message: 'Server Error' } }
    });

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, 'Test Task');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });

    expect(mockOnTaskCreated).not.toHaveBeenCalled();
  });

  it('displays error message from err.message when response.data.message is not available', async () => {
    const user = userEvent.setup();
    taskAPI.createTask = vi.fn().mockRejectedValue({
      message: 'Network Error'
    });

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, 'Test Task');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });

    expect(mockOnTaskCreated).not.toHaveBeenCalled();
  });

  it('displays default error message when neither response.data.message nor err.message is available', async () => {
    const user = userEvent.setup();
    taskAPI.createTask = vi.fn().mockRejectedValue({});

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, 'Test Task');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to create task/i)).toBeInTheDocument();
    });

    expect(mockOnTaskCreated).not.toHaveBeenCalled();
  });

  it('shows loading state while submitting', async () => {
    const user = userEvent.setup();
    taskAPI.createTask = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, 'Test Task');
    await user.click(submitButton);

    expect(screen.getByText(/creating\.\.\./i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('trims title and description before submission', async () => {
    const user = userEvent.setup();
    taskAPI.createTask = vi.fn().mockResolvedValue({
      success: true,
      data: { id: 1, title: 'Test Task', description: 'Test Description' }
    });

    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });

    await user.type(titleInput, '  Test Task  ');
    await user.type(descriptionInput, '  Test Description  ');
    await user.click(submitButton);

    await waitFor(() => {
      expect(taskAPI.createTask).toHaveBeenCalledWith('Test Task', 'Test Description');
    });
  });
});

