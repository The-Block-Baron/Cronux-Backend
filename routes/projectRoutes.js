import express from 'express'
import { createProject, readProject, updateProject, deleteProject } from '../controllers/projectController'
import authMiddleware from '../services/authMiddleware'

const router = express.Router()

router.post('/', authMiddleware, createProject)
router.get('/', authMiddleware, readProject)
router.put('/:projectId', authMiddleware, updateProject)
router.delete('/:projectId', authMiddleware, deleteProject)

export default router 