const express = require('express');
const router = express.Router();

// Importamos los controladores necesarios (estos tendrán que ser implementados)
const {
    startPomodoro,
    pausePomodoro,
    resumePomodoro,
    stopPomodoro,
    assignPomodoroToProject,
    getCurrentPomodoro
} = require('../controllers/pomodoroController');

// Rutas
router.post('/start', startPomodoro); // Iniciar un nuevo pomodoro
router.put('/pause/:pomodoroId', pausePomodoro); // Pausar un pomodoro
router.put('/resume/:pomodoroId', resumePomodoro); // Reanudar un pomodoro
router.put('/stop/:pomodoroId', stopPomodoro); // Detener un pomodoro
router.put('/assign/:pomodoroId/:projectId', assignPomodoroToProject); // Asignar pomodoro a un proyecto

// Ruta adicional para obtener el pomodoro activo del usuario
router.get('/current', getCurrentPomodoro);

module.exports = router;