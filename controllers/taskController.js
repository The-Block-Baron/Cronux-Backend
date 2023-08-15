import Project from "../models/projectModel.js";

export const createTask = async (req, res) => {
    const { projectId } = req.params;
    const { description } = req.body; // Y otros campos necesarios para la tarea

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const newTask = { description };  // Puedes agregar otros campos aquí si es necesario
        project.tasks.push(newTask);

        await project.save();

        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

export const readTasks = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ tasks: project.tasks });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateTask = async (req, res) => {
    const { projectId, taskId } = req.params;
    const { description, status, value } = req.body;  // Y cualquier otro campo que desees actualizar

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const task = project.tasks.id(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Actualiza los valores aquí
        if (description) task.description = description;
        if (status) task.status = status;
        if (value) task.value = value;

        await project.save();

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteTask = async (req, res) => {
    const { projectId, taskId } = req.params;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const taskIndex = project.tasks.findIndex(task => task._id.toString() === taskId);

        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Task not found' });
        }

        project.tasks.splice(taskIndex, 1);

        await project.save();

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}
