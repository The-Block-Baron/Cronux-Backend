const millisToTimeString = (millis) => {
    const hours = Math.floor(millis / 3600000);
    const minutes = Math.floor((millis % 3600000) / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

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
            

            task.totalTimeSpent += elapsedMillisecs;

            

            const today = new Date().toISOString().split('T')[0];

            let taskTimeEntry = task.timeEntries.find(entry => entry.date.toISOString().split('T')[0] === today);

            if (!taskTimeEntry) {
                taskTimeEntry = { date: new Date(), milliseconds: elapsedMillisecs };
                task.timeEntries.push(taskTimeEntry);
                await project.save();  
            } else {
                if (taskTimeEntry._id) {
                    task.timeEntries.id(taskTimeEntry._id).set({ milliseconds: taskTimeEntry.milliseconds + elapsedMillisecs });
                } else {
                    taskTimeEntry.milliseconds += elapsedMillisecs; 
                }
            }

            task.value = millisToTimeString(taskTimeEntry.milliseconds); 

            task.totalValue = millisToTimeString(task.totalTimeSpent)

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

            if (!timeEntry) {
                timeEntry = {
                    date: new Date(),
                    milliseconds: elapsedMillisecs
                };
                project.timeEntries.push(timeEntry);
                await project.save();  
            } else {

                if (timeEntry._id) {
                    project.timeEntries.id(timeEntry._id).set({ milliseconds: timeEntry.milliseconds + elapsedMillisecs });
                } else {
                    timeEntry.milliseconds += elapsedMillisecs; 
                }
            }
            
            project.value = millisToTimeString(timeEntry.milliseconds);
            project.totalValue = millisToTimeString(project.totalTimeSpent);

            await project.save();
        }

        res.status(200).json({ message: 'Timer paused for the project.' });
    } catch (error) {
        console.error("Error pausing project timer:", error);
        res.status(500).json({ message: error.message });
    }
}
