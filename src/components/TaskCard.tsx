import { Task } from '../types/task';
import { Member } from '../types/member';
import { formatDate } from '../utils/formatting';

interface TaskCardProps {
  task: Task;
  assignee?: Member;
  onSelect(task: Task): void;
}

const TaskCard = ({ task, assignee, onSelect }: TaskCardProps) => {
  return (
    <button
      type="button"
      className={`task-card task-card--${task.priority}`}
      onClick={() => onSelect(task)}
      aria-label={`View task ${task.title}`}
    >
      <div className="task-card__header">
        <span className="task-card__title">{task.title}</span>
        <span className={`task-card__priority task-card__priority--${task.priority}`}>
          {task.priority.toUpperCase()}
        </span>
      </div>
      <div className="task-card__meta">
        <span className="task-card__assignee">
          {assignee ? assignee.name : 'Unassigned'}
        </span>
        <span className="task-card__due">Due {formatDate(task.dueDate)}</span>
      </div>
    </button>
  );
};

export default TaskCard;
