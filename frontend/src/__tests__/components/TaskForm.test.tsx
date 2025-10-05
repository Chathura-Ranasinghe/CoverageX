import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from '../../components/TaskForm';
import { useTaskStore } from '../../store/taskStore';
import { toast } from 'sonner';

jest.mock('../../store/taskStore');
jest.mock('sonner');

describe('TaskForm', () => {
  const mockCreateTask = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useTaskStore as unknown as jest.Mock).mockReturnValue({
      createTask: mockCreateTask,
      loading: false,
    });
  });

  it('renders form with all fields', () => {
    render(<TaskForm />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<TaskForm />);
    
    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockCreateTask.mockResolvedValue(undefined);
    
    render(<TaskForm />);
    
    await user.type(screen.getByLabelText(/title/i), 'Test Task');
    await user.type(screen.getByLabelText(/description/i), 'Test Description');
    await user.click(screen.getByRole('button', { name: /create task/i }));
    
    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
      });
      expect(toast.success).toHaveBeenCalledWith('Task created successfully!');
    });
  });

  it('shows error toast when submission fails', async () => {
    const user = userEvent.setup();
    mockCreateTask.mockRejectedValue(new Error('API Error'));
    
    render(<TaskForm />);
    
    await user.type(screen.getByLabelText(/title/i), 'Test Task');
    await user.type(screen.getByLabelText(/description/i), 'Test Description');
    await user.click(screen.getByRole('button', { name: /create task/i }));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to create task.');
    });
  });

  it('disables submit button when loading', () => {
    (useTaskStore as unknown as jest.Mock).mockReturnValue({
      createTask: mockCreateTask,
      loading: true,
    });
    
    render(<TaskForm />);
    
    const submitButton = screen.getByRole('button', { name: /creating/i });
    expect(submitButton).toBeDisabled();
  });

  it('clears form after successful submission', async () => {
    const user = userEvent.setup();
    mockCreateTask.mockResolvedValue(undefined);
    
    render(<TaskForm />);
    
    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
    const descInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
    
    await user.type(titleInput, 'Test Task');
    await user.type(descInput, 'Test Description');
    await user.click(screen.getByRole('button', { name: /create task/i }));
    
    await waitFor(() => {
      expect(titleInput.value).toBe('');
      expect(descInput.value).toBe('');
    });
  });
});