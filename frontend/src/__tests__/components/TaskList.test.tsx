import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTaskStore } from '../../store/taskStore';
import { toast } from 'sonner';
import type { Task } from '../../types/task';
import { TaskList } from '@/components/TaskList';

jest.mock('../../store/taskStore');
jest.mock('sonner');

describe('TaskList', () => {
  const mockCompleteTask = jest.fn();
  const mockFetchTasks = jest.fn();
  const mockUseTaskStore = useTaskStore as jest.MockedFunction<typeof useTaskStore>;

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      completed: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      completed: false,
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseTaskStore.mockReturnValue({
      tasks: [],
      loading: true,
      error: null,
      fetchTasks: mockFetchTasks,
      createTask: jest.fn(),
      completeTask: mockCompleteTask,
      clearError: jest.fn(),
    });

    render(<TaskList />);
    
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('renders error state with retry button', () => {
    mockUseTaskStore.mockReturnValue({
      tasks: [],
      loading: false,
      error: 'Failed to fetch tasks',
      fetchTasks: mockFetchTasks,
      createTask: jest.fn(),
      completeTask: mockCompleteTask,
      clearError: jest.fn(),
    });

    render(<TaskList />);
    
    expect(screen.getByText('Failed to fetch tasks')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('calls fetchTasks when retry button is clicked', async () => {
    const user = userEvent.setup();
    mockFetchTasks.mockResolvedValue(undefined);
    
    mockUseTaskStore.mockReturnValue({
      tasks: [],
      loading: false,
      error: 'Failed to fetch tasks',
      fetchTasks: mockFetchTasks,
      createTask: jest.fn(),
      completeTask: mockCompleteTask,
      clearError: jest.fn(),
    });

    render(<TaskList />);
    
    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);

    await waitFor(() => {
      expect(mockFetchTasks).toHaveBeenCalled();
      expect(toast.info).toHaveBeenCalledWith('Retrying to load tasks...');
    });
  });

  it('renders empty state when no tasks', () => {
    mockUseTaskStore.mockReturnValue({
      tasks: [],
      loading: false,
      error: null,
      fetchTasks: mockFetchTasks,
      createTask: jest.fn(),
      completeTask: mockCompleteTask,
      clearError: jest.fn(),
    });

    render(<TaskList />);
    
    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    expect(screen.getByText('Create your first task to get started!')).toBeInTheDocument();
  });

  it('renders list of tasks', () => {
    mockUseTaskStore.mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      fetchTasks: mockFetchTasks,
      createTask: jest.fn(),
      completeTask: mockCompleteTask,
      clearError: jest.fn(),
    });

    render(<TaskList />);
    
    expect(screen.getByText('Recent Tasks')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('displays formatted creation date', () => {
    mockUseTaskStore.mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      fetchTasks: mockFetchTasks,
      createTask: jest.fn(),
      completeTask: mockCompleteTask,
      clearError: jest.fn(),
    });

    render(<TaskList />);
    
    const dates = screen.getAllByText(/Created:/);
    expect(dates).toHaveLength(2);
  });

  it('completes task when Done button is clicked', async () => {
    const user = userEvent.setup();
    mockCompleteTask.mockResolvedValue(undefined);
    
    mockUseTaskStore.mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      fetchTasks: mockFetchTasks,
      createTask: jest.fn(),
      completeTask: mockCompleteTask,
      clearError: jest.fn(),
    });

    render(<TaskList />);
    
    const doneButtons = screen.getAllByRole('button', { name: /done/i });
    await user.click(doneButtons[0]);

    await waitFor(() => {
      expect(mockCompleteTask).toHaveBeenCalledWith('1');
      expect(toast.success).toHaveBeenCalledWith('Task marked as done!');
    });
  });

  it('displays error toast when task completion fails', async () => {
    const user = userEvent.setup();
    mockCompleteTask.mockRejectedValue(new Error('Failed to complete'));
    
    mockUseTaskStore.mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      fetchTasks: mockFetchTasks,
      createTask: jest.fn(),
      completeTask: mockCompleteTask,
      clearError: jest.fn(),
    });

    render(<TaskList />);
    
    const doneButtons = screen.getAllByRole('button', { name: /done/i });
    await user.click(doneButtons[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to complete task.');
    });
  });

  it('disables Done buttons when loading', () => {
    mockUseTaskStore.mockReturnValue({
      tasks: mockTasks,
      loading: true,
      error: null,
      fetchTasks: mockFetchTasks,
      createTask: jest.fn(),
      completeTask: mockCompleteTask,
      clearError: jest.fn(),
    });

    render(<TaskList />);
    
    const doneButtons = screen.getAllByRole('button');
    doneButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('renders multiple tasks correctly', () => {
    const multipleTasks: Task[] = Array.from({ length: 5 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Task ${i + 1}`,
      description: `Description ${i + 1}`,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    mockUseTaskStore.mockReturnValue({
      tasks: multipleTasks,
      loading: false,
      error: null,
      fetchTasks: mockFetchTasks,
      createTask: jest.fn(),
      completeTask: mockCompleteTask,
      clearError: jest.fn(),
    });

    render(<TaskList />);
    
    expect(screen.getByText('Your 5 most recent incomplete tasks')).toBeInTheDocument();
    multipleTasks.forEach(task => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
    });
  });
});