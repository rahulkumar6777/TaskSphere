import { format } from 'date-fns';
import styles from './TaskCard.module.css';

const STATUS_CONFIG = {
  'todo': { label: 'To Do', cls: 'statusTodo' },
  'in-progress': { label: 'In Progress', cls: 'statusProgress' },
  'completed': { label: 'Completed', cls: 'statusDone' },
  'cancelled': { label: 'Cancelled', cls: 'statusCancelled' },
};

const PRIORITY_CONFIG = {
  high: { label: 'High', cls: 'priorityHigh' },
  medium: { label: 'Medium', cls: 'priorityMed' },
  low: { label: 'Low', cls: 'priorityLow' },
};

const STATUS_OPTIONS = ['todo', 'in-progress', 'completed', 'cancelled'];

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, style }) {
  const sc = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
  const pc = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  return (
    <div className={styles.card} style={style}>
      <div className={styles.top}>
        <div className={styles.meta}>
          <span className={`${styles.badge} ${styles[sc.cls]}`}>{sc.label}</span>
          <span className={`${styles.badge} ${styles[pc.cls]}`}>{pc.label}</span>
        </div>
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={onEdit} title="Edit">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={onDelete} title="Delete">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>

      <h3 className={`${styles.title} ${task.status === 'completed' ? styles.done : ''}`}>{task.title}</h3>
      {task.description && <p className={styles.desc}>{task.description}</p>}

      {task.tags?.length > 0 && (
        <div className={styles.tags}>
          {task.tags.slice(0, 4).map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}

      <div className={styles.bottom}>
        <span className={styles.date}>
          {format(new Date(task.createdAt), 'MMM d, yyyy')}
        </span>
        {task.dueDate && (
          <span className={`${styles.due} ${new Date(task.dueDate) < new Date() && task.status !== 'completed' ? styles.overdue : ''}`}>
            Due {format(new Date(task.dueDate), 'MMM d')}
          </span>
        )}
        <select
          className={styles.statusSelect}
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
