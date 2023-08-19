import Pomodoro from "../models/pomodoroModel.js";
import Project from "../models/projectModel.js";

export const createPomodoro = async (req, res) => {
    try {
        // Asumimos que el frontend envía las tandas, el tiempo de cada tanda y el proyecto en el cuerpo de la solicitud.
        const { tandas, workTime, breakTime, projectId } = req.body;

        if (!tandas || !workTime || !breakTime || !projectId) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Validar si el proyecto existe.
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        // Crear el nuevo Pomodoro con los datos proporcionados.
        const newPomodoro = new Pomodoro({
            tandas,
            workTime,
            breakTime,
            project: projectId
        });

        const savedPomodoro = await newPomodoro.save();

        res.status(201).json({ message: 'Pomodoro created successfully', savedPomodoro });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
