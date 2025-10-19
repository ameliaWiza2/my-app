import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCenter from '../components/TaskCenter';
import { TaskCenterProvider } from '../state/TaskCenterContext';
import { ThemeProvider } from '../state/ThemeContext';
import { NotificationService } from '../services/notificationService';
import { TaskService } from '../services/taskService';
import { Task } from '../types/task';
import { Member } from '../types/member';

type RenderResult = ReturnType<typeof renderTaskCenter>;

const seedMembers: Member[] = [
  { id: 'member-self', name: 'You', avatarColor: '#5667ff' },
  { id: 'member-1', name: 'Alex', avatarColor: '#f59e0b' }
];

const seedTasks: Task[] = [
  {
    id: 'seed-1',
    title: 'Walk the dog',
    description: 'Evening walk around the block',
    status: 'todo',
    assigneeId: null,
    dueDate: '2024-01-01T18:00:00.000Z',
    reminder: null,
    priority: 'medium',
    createdAt: '2024-01-01T10:00:00.000Z',
    updatedAt: '2024-01-01T10:00:00.000Z',
    version: 1
  },
  {
    id: 'seed-2',
    title: 'Prepare dinner',
    description: 'Cook pasta for the family',
    status: 'in_progress',
    assigneeId: 'member-1',
    dueDate: '2024-01-02T18:00:00.000Z',
    reminder: '2024-01-02T17:00:00.000Z',
    priority: 'high',
    createdAt: '2024-01-01T11:00:00.000Z',
    updatedAt: '2024-01-01T11:00:00.000Z',
    version: 2
  }
];

const renderTaskCenter = () => {
  const notifier = new NotificationService();
  const service = new TaskService({
    latency: 0,
    notifier,
    seed: {
      members: seedMembers,
      tasks: seedTasks
    }
  });

  return render(
    <ThemeProvider>
      <TaskCenterProvider services={{ taskService: service, notificationService: notifier }}>
        <TaskCenter />
      </TaskCenterProvider>
    </ThemeProvider>
  );
};

describe('TaskCenter UI', () => {
  it('renders tasks grouped by status', async () => {
    renderTaskCenter();

    await screen.findByText('Walk the dog');

    const todoColumn = screen.getByRole('heading', { name: /to do/i }).closest('section');
    const inProgressColumn = screen.getByRole('heading', { name: /in progress/i }).closest('section');
    const completedColumn = screen.getByRole('heading', { name: /completed/i }).closest('section');

    expect(todoColumn).not.toBeNull();
    expect(within(todoColumn as HTMLElement).getByText('Walk the dog')).toBeInTheDocument();
    expect(inProgressColumn).not.toBeNull();
    expect(within(inProgressColumn as HTMLElement).getByText('Prepare dinner')).toBeInTheDocument();
    expect(within(completedColumn as HTMLElement).queryByText(/no tasks/i)).toBeInTheDocument();
  });

  it('supports creating a new task with full form data', async () => {
    renderTaskCenter();
    const user = userEvent.setup();

    await screen.findByText('Walk the dog');

    await user.click(screen.getByRole('button', { name: /new task/i }));

    await user.type(screen.getByLabelText(/title/i), 'Plan weekend outing');
    await user.type(screen.getByLabelText(/description/i), 'Coordinate picnic at the park');
    await user.selectOptions(screen.getByLabelText(/assignee/i), 'member-1');
    await user.type(screen.getByLabelText(/due date/i), '2024-02-01T09:00');
    await user.type(screen.getByLabelText(/reminder/i), '2024-01-31T18:00');
    await user.selectOptions(screen.getByLabelText(/priority/i), 'low');
    await user.selectOptions(screen.getByLabelText(/status/i), 'todo');

    await user.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => expect(screen.getByText('Plan weekend outing')).toBeInTheDocument());
  });

  it('allows claiming/unclaiming and status transitions with optimistic updates', async () => {
    renderTaskCenter();
    const user = userEvent.setup();

    await screen.findByText('Walk the dog');

    await user.click(screen.getByText('Walk the dog'));

    const claimButton = await screen.findByRole('button', { name: /claim task/i });
    await user.click(claimButton);

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /unclaim task/i })).toBeInTheDocument()
    );

    await user.click(screen.getByRole('button', { name: /in progress/i }));
    await waitFor(() => {
      const inProgressColumn = screen
        .getByRole('heading', { name: /in progress/i })
        .closest('section');
      expect(
        within(inProgressColumn as HTMLElement).getByText('Walk the dog')
      ).toBeInTheDocument();
    });
  });

  it('surfaces notifications when tasks change', async () => {
    renderTaskCenter();
    const user = userEvent.setup();

    await screen.findByText('Walk the dog');
    await user.click(screen.getByText('Walk the dog'));
    await user.click(await screen.findByRole('button', { name: /claim task/i }));

    await waitFor(() => {
      const updatesPanel = screen.getByRole('heading', { name: /updates/i }).closest('aside');
      expect(within(updatesPanel as HTMLElement).getByText(/claimed by/i)).toBeInTheDocument();
    });
  });
});
