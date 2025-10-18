import TaskCard from './TaskCard';
import { Task, TASK_STATUS_LABELS, TaskStatus } from '../types/task';
import { Member } from '../types/member';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  members: Member[];
  onSelect(task: Task): void;
}

const TaskColumn = ({ status, tasks, members, onSelect }: TaskColumnProps) => {
  return (
    <section className={`task-column task-column--${status}`}>
      <header className="task-column__header">
        <h2>{TASK_STATUS_LABELS[status]}</h2>
        <span className="task-column__count">{tasks.length}</span>
      </header>
      <div className="task-column__body">
        {tasks.length === 0 ? (
          <p className="task-column__empty">No tasks</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              assignee={members.find((member) => member.id === task.assigneeId)}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default TaskColumn;
