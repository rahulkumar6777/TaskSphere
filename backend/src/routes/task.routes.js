import express from 'express';
import { contollers } from '../controllers/index.js';
import { verifyJWT } from '../middlewares/Auth.js';
import { taskQueryValidation, taskValidation } from '../middlewares/validation.js';
import { body } from 'express-validator';

const taskRouter = express.Router();


taskRouter.use(verifyJWT);

taskRouter.get('/stats', contollers.Task.getStats);
taskRouter.get('/', taskQueryValidation, contollers.Task.getTasks);
taskRouter.get('/:id', contollers.Task.getTask);
taskRouter.post('/', taskValidation, contollers.Task.createTask);
taskRouter.put('/:id', taskValidation, contollers.Task.updateTask);
taskRouter.patch('/:id/status', [body('status').isIn(['todo', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status'),], contollers.Task.updateTaskStatus);
taskRouter.delete('/:id', contollers.Task.deleteTask);

export default taskRouter;