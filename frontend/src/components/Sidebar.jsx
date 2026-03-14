import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './Sidebar.module.css';

const NAV = [
  { key: 'all', label: 'All Tasks', icon: '◈' },
  { key: 'todo', label: 'To Do', icon: '○' },
  { key: 'in-progress', label: 'In Progress', icon: '◑' },
  { key: 'completed', label: 'Completed', icon: '●' },
  { key: 'cancelled', label: 'Cancelled', icon: '✕' },
];

export default function Sidebar({ user, stats, activeStatus, onStatusFilter }) {
  const { logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try { await logout(); } catch {}
  };

  const getCount = (key) => {
    if (!stats) return null;
    if (key === 'all') return stats.total;
    return stats[key] ?? 0;
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>✦</div>
        <span className={styles.logoText}>TaskSphere</span>
      </div>

      <nav className={styles.nav}>
        <p className={styles.navLabel}>Workspace</p>
        {NAV.map((item) => (
          <button
            key={item.key}
            className={`${styles.navItem} ${activeStatus === item.key ? styles.active : ''}`}
            onClick={() => onStatusFilter(item.key)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navText}>{item.label}</span>
            {getCount(item.key) !== null && (
              <span className={styles.badge}>{getCount(item.key)}</span>
            )}
          </button>
        ))}
      </nav>

      <div className={styles.bottom}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.name}</p>
            <p className={styles.userEmail}>{user?.email}</p>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout} disabled={loggingOut}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          {loggingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </aside>
  );
}
