import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import Sidebar from '../components/Sidebar';
import TaskList from '../components/TaskList';
import TaskModal from '../components/TaskModal';
import StatsBar from '../components/StatsBar';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, pagination, stats, loading, error, fetchTasks, fetchStats, createTask, updateTask, updateStatus, deleteTask } = useTasks();

  const [filters, setFilters] = useState({ status: 'all', priority: 'all', search: '', page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' });
  const [modal, setModal] = useState({ open: false, task: null });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const load = useCallback(() => {
    const params = {};
    if (filters.status !== 'all') params.status = filters.status;
    if (filters.priority !== 'all') params.priority = filters.priority;
    if (filters.search) params.search = filters.search;
    params.page = filters.page;
    params.limit = filters.limit;
    params.sortBy = filters.sortBy;
    params.sortOrder = filters.sortOrder;
    fetchTasks(params);
    fetchStats();
  }, [filters, fetchTasks, fetchStats]);

  useEffect(() => { load(); }, [load]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = async (data) => {
    try {
      await createTask(data);
      setModal({ open: false, task: null });
      load();
      showToast('Task created successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create task', 'error');
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateTask(id, data);
      setModal({ open: false, task: null });
      load();
      showToast('Task updated');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update task', 'error');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus(id, status);
      load();
      showToast('Status updated');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setDeleteConfirm(null);
      load();
      showToast('Task deleted');
    } catch (err) {
      showToast('Failed to delete task', 'error');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value, page: key !== 'page' ? 1 : value }));
  };

  return (
    <div className={styles.layout}>
      <Sidebar user={user} stats={stats} activeStatus={filters.status} onStatusFilter={(s) => handleFilterChange('status', s)} />

      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              {filters.status === 'all' ? 'All Tasks' :
                filters.status === 'todo' ? 'To Do' :
                filters.status === 'in-progress' ? 'In Progress' :
                filters.status === 'completed' ? 'Completed' : 'Cancelled'}
            </h1>
            <p className={styles.subtitle}>
              {pagination ? `${pagination.total} task${pagination.total !== 1 ? 's' : ''}` : ''}
            </p>
          </div>
          <button className={styles.newBtn} onClick={() => setModal({ open: true, task: null })}>
            <span>+</span> New Task
          </button>
        </div>

        <StatsBar stats={stats} />

        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              className={styles.search}
              placeholder="Search tasks…"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className={styles.filterRow}>
            <select className={styles.select} value={filters.priority} onChange={(e) => handleFilterChange('priority', e.target.value)}>
              <option value="all">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select className={styles.select} value={filters.sortBy} onChange={(e) => handleFilterChange('sortBy', e.target.value)}>
              <option value="createdAt">Date created</option>
              <option value="updatedAt">Last updated</option>
              <option value="dueDate">Due date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
            <button
              className={styles.sortBtn}
              onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'desc' ? 'asc' : 'desc')}
              title="Toggle sort order"
            >
              {filters.sortOrder === 'desc' ? '↓' : '↑'}
            </button>
          </div>
        </div>

        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          onEdit={(task) => setModal({ open: true, task })}
          onDelete={(id) => setDeleteConfirm(id)}
          onStatusChange={handleStatusChange}
          onNewTask={() => setModal({ open: true, task: null })}
        />

        {pagination && pagination.totalPages > 1 && (
          <div className={styles.pagination}>
            <button className={styles.pageBtn} disabled={!pagination.hasPrevPage} onClick={() => handleFilterChange('page', filters.page - 1)}>← Prev</button>
            <span className={styles.pageInfo}>{pagination.page} / {pagination.totalPages}</span>
            <button className={styles.pageBtn} disabled={!pagination.hasNextPage} onClick={() => handleFilterChange('page', filters.page + 1)}>Next →</button>
          </div>
        )}
      </main>

      {modal.open && (
        <TaskModal
          task={modal.task}
          onClose={() => setModal({ open: false, task: null })}
          onSubmit={modal.task ? (data) => handleUpdate(modal.task._id, data) : handleCreate}
        />
      )}

      {deleteConfirm && (
        <div className={styles.overlay}>
          <div className={styles.confirmDialog}>
            <div className={styles.confirmIcon}>🗑</div>
            <h3 className={styles.confirmTitle}>Delete task?</h3>
            <p className={styles.confirmText}>This action cannot be undone.</p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`${styles.toast} ${toast.type === 'error' ? styles.toastError : styles.toastSuccess}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.message}
        </div>
      )}
    </div>
  );
}
