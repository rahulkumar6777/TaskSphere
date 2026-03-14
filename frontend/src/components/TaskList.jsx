import TaskCard from './TaskCard';
import styles from './TaskList.module.css';

export default function TaskList({ tasks, loading, error, onEdit, onDelete, onStatusChange, onNewTask }) {
  if (loading) return (
    <div className={styles.center}>
      {[...Array(4)].map((_, i) => (
        <div key={i} className={styles.skeleton} style={{ animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  );

  if (error) return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>⚠</div>
      <p className={styles.emptyTitle}>Something went wrong</p>
      <p className={styles.emptyText}>{error}</p>
    </div>
  );

  if (tasks.length === 0) return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>◈</div>
      <p className={styles.emptyTitle}>No tasks found</p>
      <p className={styles.emptyText}>Create your first task to get started</p>
      <button className={styles.emptyBtn} onClick={onNewTask}>+ New Task</button>
    </div>
  );

  return (
    <div className={styles.list}>
      {tasks.map((task, i) => (
        <TaskCard
          key={task._id}
          task={task}
          style={{ animationDelay: `${i * 0.04}s` }}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task._id)}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
