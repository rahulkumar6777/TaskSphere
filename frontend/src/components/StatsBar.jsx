import styles from './StatsBar.module.css';

const STATS = [
  { key: 'total', label: 'Total', color: 'default' },
  { key: 'todo', label: 'To Do', color: 'info' },
  { key: 'in-progress', label: 'In Progress', color: 'warning' },
  { key: 'completed', label: 'Completed', color: 'success' },
];

export default function StatsBar({ stats }) {
  if (!stats) return null;

  return (
    <div className={styles.bar}>
      {STATS.map((s) => (
        <div key={s.key} className={`${styles.card} ${styles[s.color]}`}>
          <span className={styles.num}>{stats[s.key] ?? 0}</span>
          <span className={styles.label}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
