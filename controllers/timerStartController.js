import Project from "../models/projectModel.js";


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

        const today = new Date().toISOString().split('T')[0];
        let timeEntry = project.timeEntries.find(entry => entry.date.toISOString().split('T')[0] === today);
        if (!timeEntry) {

            timeEntry = { date: new Date(), milliseconds: 0 };
            project.timeEntries.push(timeEntry);
        }

        await project.save();
        res.status(200).json({ message: 'Timer started for the task.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const startProjectTimer = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }


        project.timerRunning = true;
        project.timerStartedAt = new Date();

        const today = new Date().toISOString().split('T')[0];
        let timeEntry = project.timeEntries.find(entry => entry.date.toISOString().split('T')[0] === today);

        if (!timeEntry) {
            timeEntry = { date: new Date(), milliseconds: 0 };
            project.timeEntries.push(timeEntry);
        }

        await project.save();
        res.status(200).json({ message: 'Timer started for the project.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
