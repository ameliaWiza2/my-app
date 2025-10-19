import { Task, TaskStatus, TASK_STATUS_LABELS } from '../types/task';
import { Member } from '../types/member';
import { formatDateTime } from '../utils/formatting';

interface TaskDetailModalProps {
  task: Task;
  members: Member[];
  currentUserId: string;
  isPending: boolean;
  onClose(): void;
  onEdit(taskId: string): void;
  onTransition(taskId: string, status: TaskStatus): void;
  onClaim(taskId: string, memberId: string): void;
  onUnclaim(taskId: string): void;
}

const TaskDetailModal = ({
  task,
  members,
  currentUserId,
  isPending,
  onClose,
  onEdit,
  onTransition,
  onClaim,
  onUnclaim
}: TaskDetailModalProps) => {
  const assignee = members.find((member) => member.id === task.assigneeId);
  const isClaimedByCurrentUser = task.assigneeId === currentUserId;
  const canClaim = !task.assigneeId || task.assigneeId === currentUserId;

  const handleStatusChange = (status: TaskStatus) => {
    if (status === task.status) {
      return;
    }
    onTransition(task.id, status);
  };

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <h2 id="task-detail-title">{task.title}</h2>
          <button type="button" className="modal__close" onClick={onClose}>
            ×
          </button>
        </header>
        <section className="modal__section">
          <p className="modal__description">{task.description}</p>
          <dl className="modal__details">
            <div>
              <dt>Status</dt>
              <dd>{TASK_STATUS_LABELS[task.status]}</dd>
            </div>
            <div>
              <dt>Assignee</dt>
              <dd>{assignee ? assignee.name : 'Unassigned'}</dd>
            </div>
            <div>
              <dt>Due</dt>
              <dd>{formatDateTime(task.dueDate)}</dd>
            </div>
            <div>
              <dt>Reminder</dt>
              <dd>{formatDateTime(task.reminder)}</dd>
            </div>
            <div>
              <dt>Priority</dt>
              <dd className={`modal__priority modal__priority--${task.priority}`}>
                {task.priority.toUpperCase()}
              </dd>
            </div>
          </dl>
        </section>
        <section className="modal__section">
          <h3 className="modal__subtitle">Update status</h3>
          <div className="modal__status-grid">
            {(['todo', 'in_progress', 'completed'] as TaskStatus[]).map((status) => (
              <button
                key={status}
                type="button"
                className={`modal__status-button${
                  status === task.status ? ' modal__status-button--active' : ''
                }`}
                onClick={() => handleStatusChange(status)}
                disabled={isPending}
              >
                {TASK_STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </section>
        <section className="modal__section modal__actions">
          {canClaim && (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() =>
                isClaimedByCurrentUser
                  ? onUnclaim(task.id)
                  : onClaim(task.id, currentUserId)
              }
              disabled={isPending}
            >
              {isClaimedByCurrentUser ? 'Unclaim task' : 'Claim task'}
            </button>
          )}
          <button
            type="button"
            className="btn"
            onClick={() => onEdit(task.id)}
            disabled={isPending}
          >
            Edit task
          </button>
        </section>
      </div>
    </div>
  );
};

export default TaskDetailModal;
