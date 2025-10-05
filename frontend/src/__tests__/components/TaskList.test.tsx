import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from '../../components/TaskList';
import { useTaskStore } from '../../store/taskStore';
import { toast } from 'sonner';

jest.mock('../../store/taskStore');
jest.mock('sonner');

const mockTasks = [
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

describe('TaskList', () => {
  const mockCompleteTask = jest.fn();
  const mockFetchTasks = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state', () => {
    (useTaskStore as unknown as jest.Mock).mockReturnValue({
      tasks: [],
      loading: true,
      error: null,
      completeTask: mockCompleteTask,
      fetchTasks: mockFetchTasks,
    });

    render(<TaskList />);
    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
  });

  it('shows error state with retry button', async () => {
    const user = userEvent.setup();
    (useTaskStore as unknown as jest.Mock).mockReturnValue({
      tasks: [],
      loading: false,
      error: 'Failed to load tasks',
      completeTask: mockCompleteTask,
      fetchTasks: mockFetchTasks,
    });

    render(<TaskList />);
    
    expect(screen.getByText(/failed to load tasks/i)).toBeInTheDocument();
    
    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);
    
    expect(mockFetchTasks).toHaveBeenCalled();
  });

  it('shows empty state when no tasks', () => {
    (useTaskStore as unknown as jest.Mock).mockReturnValue({
      tasks: [],
      loading: false,
      error: null,
      completeTask: mockCompleteTask,
      fetchTasks: mockFetchTasks,
    });

    render(<TaskList />);
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  it('renders list of tasks', () => {
    (useTaskStore as unknown as jest.Mock).mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      completeTask: mockCompleteTask,
      fetchTasks: mockFetchTasks,
    });

    render(<TaskList />);
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('completes task when Done button is clicked', async () => {
    const user = userEvent.setup();
    mockCompleteTask.mockResolvedValue(undefined);
    
    (useTaskStore as unknown as jest.Mock).mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      completeTask: mockCompleteTask,
      fetchTasks: mockFetchTasks,
    });

    render(<TaskList />);
    
    const doneButtons = screen.getAllByRole('button', { name: /done/i });
    await user.click(doneButtons[0]);
    
    await waitFor(() => {
      expect(mockCompleteTask).toHaveBeenCalledWith('1');
      expect(toast.success).toHaveBeenCalledWith('Task marked as done!');
    });
  });

  it('shows error toast when task completion fails', async () => {
    const user = userEvent.setup();
    mockCompleteTask.mockRejectedValue(new Error('API Error'));
    
    (useTaskStore as unknown as jest.Mock).mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null,
      completeTask: mockCompleteTask,
      fetchTasks: mockFetchTasks,
    });

    render(<TaskList />);
    
    const doneButtons = screen.getAllByRole('button', { name: /done/i });
    await user.click(doneButtons[0]);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to complete task.');
    });
  });

  it('disables Done buttons when loading', () => {
    (useTaskStore as unknown as jest.Mock).mockReturnValue({
      tasks: mockTasks,
      loading: true,
      error: null,
      completeTask: mockCompleteTask,
      fetchTasks: mockFetchTasks,
    });

    render(<TaskList />);
    
    const doneButtons = screen.getAllByRole('button', { name: /\.\.\./i });
    doneButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });
});