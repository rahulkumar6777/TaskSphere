import axios from "axios";

const BASE = import.meta.env.VITE_API_URL;


export const api = axios.create({
  baseURL: `${BASE}/api/auth`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});


export const tasksApi = axios.create({
  baseURL: `${BASE}/api/tasks`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});


export const attachInterceptors = (refreshFn, logoutFn) => {
  const ejectFns = [api, tasksApi].map((instance) => {
    
    const reqId = instance.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    let isRefreshing = false;
    let waitingQueue = [];

    const processQueue = (error) => {
      waitingQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
      waitingQueue = [];
    };

    const resId = instance.interceptors.response.use(
      (res) => res,
      async (error) => {
        const original = error.config;

        if (error.response?.status !== 401 || original._retry) {
          return Promise.reject(error);
        }

        
        if (original.url?.includes("/refresh/refreshtoken")) {
          logoutFn();
          return Promise.reject(error);
        }

        original._retry = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            waitingQueue.push({ resolve, reject });
          })
            .then(() => instance(original))
            .catch((e) => Promise.reject(e));
        }

        isRefreshing = true;

        try {
          await refreshFn();
          processQueue(null);
          return instance(original);
        } catch (refreshError) {
          processQueue(refreshError);
          logoutFn();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    );

    return () => {
      instance.interceptors.request.eject(reqId);
      instance.interceptors.response.eject(resId);
    };
  });


  return () => ejectFns.forEach((fn) => fn());
};
