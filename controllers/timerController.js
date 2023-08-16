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

    const millisToTimeString = (millis) => {
        const hours = Math.floor(millis / 3600000);
        const minutes = Math.floor((millis % 3600000) / 60000);
        const seconds = Math.floor((millis % 60000) / 1000);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

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
            

            task.totalTimeSpent += elapsedMillisecs;

            

            const today = new Date().toISOString().split('T')[0];

            let taskTimeEntry = task.timeEntries.find(entry => entry.date.toISOString().split('T')[0] === today);
            if (!taskTimeEntry) {
                taskTimeEntry = { date: new Date(), milliseconds: 0 };
                task.timeEntries.push(taskTimeEntry);
            }

                task.timeEntries.id(taskTimeEntry._id).set({ milliseconds: taskTimeEntry.milliseconds + elapsedMillisecs });
                task.value = millisToTimeString(taskTimeEntry.milliseconds + elapsedMillisecs);  // Actualizar value con el tiempo para hoy

            
            task.totalValue = millisToTimeString(task.totalTimeSpent); // Actualizar totalValue con el tiempo total

            task.timerRunning = false;
            task.timerStartedAt = null;
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
