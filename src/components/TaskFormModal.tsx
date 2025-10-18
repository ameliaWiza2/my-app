import { useEffect, useMemo, useState } from 'react';
import { Task, TaskDraft, TaskPriority, TaskStatus, TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from '../types/task';
import { Member } from '../types/member';

interface TaskFormModalProps {
  mode: 'create' | 'edit';
  task?: Task;
  members: Member[];
  isSubmitting: boolean;
  onClose(): void;
  onSubmit(draft: TaskDraft): Promise<void> | void;
}

type FormState = {
  title: string;
  description: string;
  assigneeId: string;
  dueDate: string;
  reminder: string;
  priority: TaskPriority;
  status: TaskStatus;
};

const DEFAULT_FORM: FormState = {
  title: '',
  description: '',
  assigneeId: '',
  dueDate: '',
  reminder: '',
  priority: 'medium',
  status: 'todo'
};

const toInputDateTime = (value: string | null): string => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const pad = (input: number) => input.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const fromInputDateTime = (value: string): string | null => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const TaskFormModal = ({ mode, task, members, isSubmitting, onClose, onSubmit }: TaskFormModalProps) => {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && task) {
      setForm({
        title: task.title,
        description: task.description,
        assigneeId: task.assigneeId ?? '',
        dueDate: toInputDateTime(task.dueDate),
        reminder: toInputDateTime(task.reminder),
        priority: task.priority,
        status: task.status
      });
    } else {
      setForm(DEFAULT_FORM);
    }
  }, [mode, task]);

  const assigneeOptions = useMemo(
    () => [{ id: '', name: 'Unassigned' }, ...members],
    [members]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    const draft: TaskDraft = {
      title: form.title.trim(),
      description: form.description.trim(),
      assigneeId: form.assigneeId ? form.assigneeId : null,
      dueDate: fromInputDateTime(form.dueDate),
      reminder: fromInputDateTime(form.reminder),
      priority: form.priority,
      status: form.status
    };
    try {
      await onSubmit(draft);
      onClose();
      setError(null);
    } catch (submitError) {
      setError((submitError as Error).message);
    }
  };

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <h2 id="task-form-title">{mode === 'create' ? 'Create task' : 'Edit task'}</h2>
          <button type="button" className="modal__close" onClick={onClose}>
            ×
          </button>
        </header>
        <form className="task-form" onSubmit={handleSubmit}>
          <label className="task-form__field">
            <span>Title</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              required
            />
          </label>
          <label className="task-form__field">
            <span>Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add context, steps, or links"
              rows={4}
            />
          </label>
          <label className="task-form__field">
            <span>Assignee</span>
            <select name="assigneeId" value={form.assigneeId} onChange={handleChange}>
              {assigneeOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
          <div className="task-form__grid">
            <label className="task-form__field">
              <span>Due date</span>
              <input
                type="datetime-local"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
              />
            </label>
            <label className="task-form__field">
              <span>Reminder</span>
              <input
                type="datetime-local"
                name="reminder"
                value={form.reminder}
                onChange={handleChange}
              />
            </label>
          </div>
          <label className="task-form__field">
            <span>Priority</span>
            <select name="priority" value={form.priority} onChange={handleChange}>
              {(Object.keys(TASK_PRIORITY_LABELS) as TaskPriority[]).map((priority) => (
                <option key={priority} value={priority}>
                  {TASK_PRIORITY_LABELS[priority]}
                </option>
              ))}
            </select>
          </label>
          <label className="task-form__field">
            <span>Status</span>
            <select name="status" value={form.status} onChange={handleChange}>
              {(Object.keys(TASK_STATUS_LABELS) as TaskStatus[]).map((status) => (
                <option key={status} value={status}>
                  {TASK_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>
          {error && <p className="task-form__error" role="alert">{error}</p>}
          <footer className="task-form__actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
              {mode === 'create' ? 'Create task' : 'Save changes'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
