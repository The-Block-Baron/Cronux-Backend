import express from 'express'
import {
    createTask, readTasks, updateTask, deleteTask
} from '../controllers/taskController.js'
import { startTaskTimer, pauseTaskTimer } from '../controllers/timerController.js'

const router = express.Router()

router.post('/:projectId/tasks', createTask)

router.put('/:projectId/tasks/:taskId', updateTask)

router.get('/:projectId/tasks', readTasks)

router.delete('/:projectId/tasks/:taskId', deleteTask)

router.post('/:projectId/tasks/:taskId/start', startTaskTimer);

router.post('/:projectId/tasks/:taskId/pause', pauseTaskTimer);

export default router