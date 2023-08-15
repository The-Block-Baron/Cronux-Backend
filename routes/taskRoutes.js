import express from 'express'
import {
    createTask, readTasks, updateTask, deleteTask
} from '../controllers/taskController'
import { startTaskTimer, pauseTaskTimer } from '../controllers/timerController'

const router = express.Router()

router.post('/projects/:projectId/tasks', createTask)

router.put('/projects/:projectId/tasks/:taskId', updateTask)

router.get('/projects/:projectId/tasks', readTasks)

router.delete('/projects/:projectId/tasks/:taskId', deleteTask)

router.post('/projects/:projectId/tasks/:taskId/start', startTaskTimer);

router.post('/projects/:projectId/tasks/:taskId/pause', pauseTaskTimer);

export default router