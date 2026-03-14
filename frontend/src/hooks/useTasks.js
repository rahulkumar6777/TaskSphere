import { useState, useCallback } from "react";
import { tasksApi } from "../api/apiclient";  

export function useTasks() {
  const [tasks, setTasks]         = useState([]);
  const [pagination, setPagination] = useState(null);
  const [stats, setStats]         = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await tasksApi.get("/", { params });
      setTasks(data.data.tasks);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await tasksApi.get("/stats");
      setStats(data.data.stats);
    } catch {}
  }, []);

  const createTask = async (taskData) => {
    const { data } = await tasksApi.post("/", taskData);
    return data.data.task;
  };

  const updateTask = async (id, taskData) => {
    const { data } = await tasksApi.put(`/${id}`, taskData);
    return data.data.task;
  };

  const updateStatus = async (id, status) => {
    const { data } = await tasksApi.patch(`/${id}/status`, { status });
    return data.data.task;
  };

  const deleteTask = async (id) => {
    await tasksApi.delete(`/${id}`);
  };

  return {
    tasks, pagination, stats, loading, error,
    fetchTasks, fetchStats, createTask, updateTask, updateStatus, deleteTask,
    setTasks,
  };
}
