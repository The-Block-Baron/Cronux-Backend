import express from 'express'
import { createProject, readProject, updateProject, deleteProject } from '../controllers/projectController.js'
import authMiddleware from '../services/authMiddleware.js'
import { startProjectTimer, pauseProjectTimer } from '../controllers/timerController.js'

const router = express.Router()

router.post('/', authMiddleware, createProject)

router.get('/', authMiddleware, readProject)

router.put('/:projectId', authMiddleware, updateProject)

router.delete('/:projectId', authMiddleware, deleteProject)

router.post('/projects/:projectId/start', startProjectTimer);

router.post('/projects/:projectId/pause', pauseProjectTimer);

export default router 