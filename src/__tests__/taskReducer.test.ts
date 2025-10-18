import { describe, expect, it } from 'vitest';
import { taskReducer, initialTaskState, TaskState } from '../state/taskReducer';
import { Task } from '../types/task';
import { Member } from '../types/member';

const baseTask: Task = {
  id: 'task-1',
  title: 'Sample',
  description: 'Sample description',
  status: 'todo',
  assigneeId: null,
  dueDate: null,
  reminder: null,
  priority: 'medium',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  version: 1
};

const baseMember: Member = {
  id: 'member-1',
  name: 'Alex',
  avatarColor: '#000'
};

describe('taskReducer', () => {
  it('handles load success', () => {
    const state = taskReducer(initialTaskState, {
      type: 'tasks/load-success',
      payload: {
        tasks: [baseTask],
        members: [baseMember]
      }
    });

    expect(state.isLoading).toBe(false);
    expect(state.tasks).toHaveLength(1);
    expect(state.members[0].name).toBe('Alex');
  });

  it('tracks optimistic mutation lifecycle', () => {
    const optimisticTask: Task = { ...baseTask, title: 'Updated', version: 2 };
    const optimisticState = taskReducer(
      { ...initialTaskState, tasks: [baseTask] },
      {
        type: 'tasks/optimistic-upsert',
        payload: { task: optimisticTask, previous: baseTask }
      }
    );

    expect(optimisticState.tasks[0].title).toBe('Updated');
    expect(optimisticState.pendingTaskIds).toContain('task-1');

    const committed = taskReducer(optimisticState, {
      type: 'tasks/mutation-commit',
      payload: { ...optimisticTask, version: 3 }
    });

    expect(committed.pendingTaskIds).not.toContain('task-1');
    expect(committed.tasks[0].version).toBe(3);
  });

  it('records conflicts and reconciles with server task', () => {
    const optimisticTask: Task = { ...baseTask, title: 'Locally updated', version: 2 };
    const optimisticState: TaskState = {
      ...initialTaskState,
      tasks: [optimisticTask],
      pendingTaskIds: ['task-1'],
      members: [],
      notifications: [],
      isLoading: false,
      isSyncing: false,
      error: null,
      conflict: null
    };

    const serverTask: Task = { ...baseTask, title: 'Server update', version: 4 };
    const conflicted = taskReducer(optimisticState, {
      type: 'tasks/conflict-detected',
      payload: {
        message: 'Conflict detected',
        task: serverTask
      }
    });

    expect(conflicted.pendingTaskIds).not.toContain('task-1');
    expect(conflicted.tasks[0].title).toBe('Server update');
    expect(conflicted.conflict?.taskId).toBe('task-1');
  });
});
