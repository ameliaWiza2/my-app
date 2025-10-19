import { useMemo, useState } from 'react';
import TaskColumn from './TaskColumn';
import TaskDetailModal from './TaskDetailModal';
import TaskFormModal from './TaskFormModal';
import NotificationTray from './NotificationTray';
import { useTaskCenter } from '../state/TaskCenterContext';
import { Task, TASK_STATUS_ORDER, TaskDraft } from '../types/task';

interface FormState {
  open: boolean;
  mode: 'create' | 'edit';
  taskId?: string;
}

const initialFormState: FormState = {
  open: false,
  mode: 'create'
};

const TaskCenter = () => {
  const {
    state,
    members,
    tasksByStatus,
    notifications,
    currentUserId,
    createTask,
    editTask,
    transitionTask,
    claimTask,
    unclaimTask,
    refresh,
    clearConflict
  } = useTaskCenter();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>(initialFormState);

  const selectedTask: Task | undefined = useMemo(
    () => state.tasks.find((task) => task.id === selectedTaskId),
    [selectedTaskId, state.tasks]
  );

  const isPending = (taskId?: string | null) =>
    taskId ? state.pendingTaskIds.includes(taskId) : false;

  const openCreateForm = () => {
    setFormState({ open: true, mode: 'create' });
  };

  const openEditForm = (taskId: string) => {
    setFormState({ open: true, mode: 'edit', taskId });
  };

  const closeForm = () => setFormState(initialFormState);

  const handleTaskSelect = (task: Task) => {
    setSelectedTaskId(task.id);
  };

  const handleDetailClose = () => {
    setSelectedTaskId(null);
  };

  const handleFormSubmit = async (draft: TaskDraft) => {
    if (formState.mode === 'create') {
      await createTask(draft);
    } else if (formState.mode === 'edit' && formState.taskId) {
      await editTask(formState.taskId, draft);
    }
  };

  return (
    <div className="task-center">
      <header className="task-center__header">
        <div>
          <h1>Family task center</h1>
          <p className="task-center__subtitle">
            Stay organized together with real-time updates and smart reminders.
          </p>
        </div>
        <div className="task-center__actions">
          <button type="button" className="btn" onClick={refresh} disabled={state.isLoading}>
            Refresh
          </button>
          <button type="button" className="btn btn--primary" onClick={openCreateForm}>
            New task
          </button>
        </div>
      </header>

      {state.error && (
        <div className="banner banner--error" role="alert">
          {state.error}
        </div>
      )}

      {state.conflict && (
        <div className="banner banner--conflict" role="alert">
          <span>{state.conflict.message}</span>
          <button type="button" className="btn btn--ghost" onClick={clearConflict}>
            Dismiss
          </button>
        </div>
      )}

      <div className="task-center__content">
        <div className="task-center__columns">
          {TASK_STATUS_ORDER.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              members={members}
              onSelect={handleTaskSelect}
            />
          ))}
        </div>
        <NotificationTray notifications={notifications} />
      </div>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          members={members}
          currentUserId={currentUserId}
          onClose={handleDetailClose}
          onEdit={(taskId) => {
            openEditForm(taskId);
            handleDetailClose();
          }}
          onTransition={transitionTask}
          onClaim={claimTask}
          onUnclaim={unclaimTask}
          isPending={isPending(selectedTask.id)}
        />
      )}

      {formState.open && (
        <TaskFormModal
          mode={formState.mode}
          task={formState.taskId ? state.tasks.find((task) => task.id === formState.taskId) : undefined}
          members={members}
          isSubmitting={formState.taskId ? isPending(formState.taskId) : false}
          onClose={closeForm}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default TaskCenter;
