import Project from "../models/projectModel";

export const startTaskTimer = async (req, res) => {
    const { projectId, taskId } = req.params;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const task = project.tasks.id(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.status === "done") {
            return res.status(400).json({ message: 'Cannot start timer for a task marked as done.' });
        }

        task.timerRunning = true;
        task.timerStartedAt = new Date();

        await project.save();

        res.status(200).json({ message: 'Timer started for the task.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}