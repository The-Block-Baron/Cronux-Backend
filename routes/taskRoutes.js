import express from 'express'
import {
    createTask, readTasks, updateTask, deleteTask
} from '../controllers/taskController.js'
import { startTaskTimer } from '../controllers/timerStartController.js'
import { pauseTaskTimer } from '../controllers/timerPauseController.js'
import authMiddleware from '../services/authMiddleware.js'

const router = express.Router()

router.post('/:projectId/tasks', authMiddleware, createTask)

router.put('/:projectId/tasks/:taskId', authMiddleware, updateTask)

router.get('/:projectId/tasks', authMiddleware, readTasks)

router.delete('/:projectId/tasks/:taskId', authMiddleware, deleteTask)

router.post('/:projectId/tasks/:taskId/start', authMiddleware, startTaskTimer);

router.post('/:projectId/tasks/:taskId/pause', authMiddleware, pauseTaskTimer);

export default router