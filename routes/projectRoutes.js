import express from 'express'
import { createProject, readProject, updateProject, deleteProject } from '../controllers/projectController.js'
import authMiddleware from '../services/authMiddleware.js'
import { startProjectTimer } from '../controllers/timerStartController.js'
import { pauseProjectTimer } from '../controllers/timerPauseController.js'

const router = express.Router()

router.post('/', authMiddleware, createProject)

router.get('/', authMiddleware, readProject)

router.put('/:projectId', authMiddleware, updateProject)

router.delete('/:projectId', authMiddleware, deleteProject)

router.post('/:projectId/start', startProjectTimer);

router.post('/:projectId/pause', pauseProjectTimer);

export default router 