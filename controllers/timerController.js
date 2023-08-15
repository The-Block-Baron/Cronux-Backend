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

export const pauseTaskTimer = async (req, res) => {
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

        if (task.timerRunning) {
            const currentTime = new Date();
            const elapsedMillisecs = currentTime - new Date(task.timerStartedAt);

            task.timeSpent += elapsedMillisecs;
            task.timerRunning = false;
            task.timerStartedAt = null;

            task.totalTimeSpent += elapsedMillisecs;

            const today = new Date().toISOString().split('T')[0];


            let taskTimeEntry = task.timeEntries.find(entry => entry.date.toISOString().split('T')[0] === today);
            if (!taskTimeEntry) {
                taskTimeEntry = { date: new Date(), milliseconds: 0 };
                task.timeEntries.push(taskTimeEntry);
            }
            task.timeEntries.id(taskTimeEntry._id).set({ milliseconds: taskTimeEntry.milliseconds + elapsedMillisecs });

            project.totalTimeSpent += elapsedMillisecs;


            let projectTimeEntry = project.timeEntries.find(entry => entry.date.toISOString().split('T')[0] === today);
            if (!projectTimeEntry) {
                projectTimeEntry = { date: new Date(), milliseconds: 0 };
                project.timeEntries.push(projectTimeEntry);
            }
            project.timeEntries.id(projectTimeEntry._id).set({ milliseconds: projectTimeEntry.milliseconds + elapsedMillisecs });

            await project.save();
        }

        res.status(200).json({ message: 'Timer paused for the task.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const pauseProjectTimer = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.timerRunning) {
            const currentTime = new Date();
            const elapsedMillisecs = currentTime - new Date(project.timerStartedAt);
            project.totalTimeSpent += elapsedMillisecs;
            project.timerRunning = false;
            project.timerStartedAt = null;

            const today = new Date().toISOString().split('T')[0];
            let timeEntry = project.timeEntries.find(entry => entry.date.toISOString().split('T')[0] === today);

            console.log("Time Entry before update:", timeEntry); 

            if (!timeEntry) {
                timeEntry = {
                    date: new Date(),
                    milliseconds: elapsedMillisecs
                };
                project.timeEntries.push(timeEntry);
            } else {
                timeEntry.milliseconds += elapsedMillisecs;
            }

            console.log("Time Entry after update:", timeEntry); 

            await project.save();
        }

        res.status(200).json({ message: 'Timer paused for the project.' });
    } catch (error) {
        console.error("Error pausing project timer:", error); 
        res.status(500).json({ message: error.message });
    }
}
