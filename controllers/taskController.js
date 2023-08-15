import Project from "../models/projectModel";

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