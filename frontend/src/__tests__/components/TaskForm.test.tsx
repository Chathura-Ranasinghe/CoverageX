import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from '../../components/TaskForm';
import { useTaskStore } from '../../store/taskStore';
import { toast } from 'sonner';

jest.mock('../../store/taskStore');
jest.mock('sonner');

describe('TaskForm', () => {
  const mockCreateTask = jest.fn();
  const mockUseTaskStore = useTaskStore as jest.MockedFunction<typeof useTaskStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTaskStore.mockReturnValue({
      createTask: mockCreateTask,
      loading: false,
      tasks: [],
      error: null,
      fetchTasks: jest.fn(),
      completeTask: jest.fn(),
      clearError: jest.fn(),
    });
  });

  it('renders the form with all fields', () => {
    render(<TaskForm />);
    
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  it('displays validation error when title is empty', async () => {
    const user = userEvent.setup();
    render(<TaskForm />);

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  it('displays validation error when description is empty', async () => {
    const user = userEvent.setup();
    render(<TaskForm />);

    const titleInput = screen.getByLabelText('Title');
    await user.type(titleInput, 'Test Task');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
  });

  it('submits form successfully with valid data', async () => {
    const user = userEvent.setup();
    mockCreateTask.mockResolvedValue(undefined);
    
    render(<TaskForm />);

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    
    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, 'Test Description');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
      });
      expect(toast.success).toHaveBeenCalledWith('Task created successfully!');
    });
  });

  it('displays error toast when task creation fails', async () => {
    const user = userEvent.setup();
    mockCreateTask.mockRejectedValue(new Error('Failed to create'));
    
    render(<TaskForm />);

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    
    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, 'Test Description');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to create task.');
    });
  });

  it('clears form after successful submission', async () => {
    const user = userEvent.setup();
    mockCreateTask.mockResolvedValue(undefined);
    
    render(<TaskForm />);

    const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
    const descriptionInput = screen.getByLabelText('Description') as HTMLTextAreaElement;
    
    await user.type(titleInput, 'Test Task');
    await user.type(descriptionInput, 'Test Description');

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(titleInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
    });
  });

  it('disables submit button when loading', () => {
    mockUseTaskStore.mockReturnValue({
      createTask: mockCreateTask,
      loading: true,
      tasks: [],
      error: null,
      fetchTasks: jest.fn(),
      completeTask: jest.fn(),
      clearError: jest.fn(),
    });

    render(<TaskForm />);

    const submitButton = screen.getByRole('button', { name: /creating/i });
    expect(submitButton).toBeDisabled();
  });

  it('validates title max length', async () => {
    const user = userEvent.setup();
    render(<TaskForm />);

    const titleInput = screen.getByLabelText('Title');
    const longTitle = 'a'.repeat(201);
    
    await user.type(titleInput, longTitle);

    const submitButton = screen.getByRole('button', { name: /create task/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title too long')).toBeInTheDocument();
    });
  });
});