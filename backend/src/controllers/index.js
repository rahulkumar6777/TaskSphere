import { initRegistration } from "./auth/initRegister.controller.js";
import { Login } from "./auth/Login.controller.js";
import { Logout } from "./auth/Logout.Controller.js";
import { getMe } from "./auth/me.controller.js";
import { RefreshToken } from "./auth/RefreshToken.Controller.js";
import { verifyRegister } from "./auth/verifyRegister.controller.js";
import { createTask } from "./task/createTask.controller.js";
import { deleteTask } from "./task/deleteTask.controller.js";
import { getStats } from "./task/getStats.controller.js";
import { getTask } from "./task/getTask.controller.js";
import { getTasks } from "./task/getTasks.controller.js";
import { updateTask } from "./task/updateTask.controller.js";
import { updateTaskStatus } from "./task/updateTaskStatus.controller.js";


export const contollers = {
    Auth: {
        Register: {
            init: initRegistration,
            verify: verifyRegister
        },
        Login,
        RefreshToken,
        Logout,
        getMe
    },
    Task: {
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        getTask,
        getTasks,
        getStats
    }
}