import express from 'express';
import taskController from '../controllers/taskController.js';

const router = express.Router();

router.post('/', taskController.createTask.bind(taskController));
router.get('/', taskController.getRecentTasks.bind(taskController));
router.patch('/:id/complete', taskController.completeTask.bind(taskController));

export default router;

