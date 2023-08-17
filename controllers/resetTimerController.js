import Project from "../models/projectModel.js";

const millisToTimeString = (millis) => {
    const hours = Math.floor(millis / 3600000);
    const minutes = Math.floor((millis % 3600000) / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const resetProjectTimer = async (req, res) => {
    const { projectId } = req.params;

    try {
        const updateResult = await Project.updateOne(
            { _id: projectId },
            {
                $set: {
                    timerRunning: false,
                    timerStartedAt: null,
                    totalTimeSpent: 0,
                    value: '00:00:00',
                    totalValue: '00:00:00',
                    timeEntries: [],
                    status: 'to do',
                    "tasks.$[].timerRunning": false,     
                    "tasks.$[].timerStartedAt": null,
                    "tasks.$[].totalTimeSpent": 0,
                    "tasks.$[].timeEntries": [],
                    "tasks.$[].value": '00:00:00',
                    "tasks.$[].totalValue": '00:00:00',
                    "tasks.$[].status": 'to do'
                }
            }
        );

        if (updateResult.nModified === 0) {
            return res.status(404).json({ message: 'Project not found or no changes were made.' });
        }

        res.status(200).json({ message: 'Project timer and all associated task timers have been reset.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const resetTaskTimer = async (req, res) => {
    const { projectId, taskId } = req.params;

    try {
        const project = await Project.findOne({ "_id": projectId, "tasks._id": taskId }, { "tasks.$": 1 });
        
        if (!project || !project.tasks || project.tasks.length === 0) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        const task = project.tasks[0];
        const today = new Date().toISOString().split('T')[0];
        const taskTimeEntryToday = task.timeEntries && task.timeEntries.find(entry => entry.date.toISOString().split('T')[0] === today);

        let taskMillisToday = taskTimeEntryToday ? taskTimeEntryToday.milliseconds : 0;

        // Actualizar la tarea y el proyecto simultáneamente
        const updateOperations = {
            $set: {
                "tasks.$.timerRunning": false,
                "tasks.$.timerStartedAt": null,
                "tasks.$.totalTimeSpent": 0,
                "tasks.$.timeEntries": [],
                "tasks.$.value": '00:00:00',
                "tasks.$.totalValue": '00:00:00',
                "tasks.$.status": 'to do'
            },
            $inc: {
                totalTimeSpent: -task.totalTimeSpent
            }
        };

        if (project.timeEntries) {
            const projectTimeEntryTodayIndex = project.timeEntries.findIndex(entry => entry.date.toISOString().split('T')[0] === today);
            if (projectTimeEntryTodayIndex !== -1) {
                updateOperations.$inc[`timeEntries.${projectTimeEntryTodayIndex}.milliseconds`] = -taskMillisToday;
            }
        }

        const updateResult = await Project.updateOne(
            { "_id": projectId, "tasks._id": taskId },
            updateOperations
        );

        if (updateResult.nModified === 0) {
            return res.status(404).json({ message: 'Task not found or no changes were made.' });
        }

        // Actualizar los valores de `value` y `totalValue` del proyecto después de la actualización
        const updatedProject = await Project.findById(projectId);
        updatedProject.value = millisToTimeString(updatedProject.totalTimeSpent);
        updatedProject.totalValue = millisToTimeString(updatedProject.totalTimeSpent);
        await updatedProject.save();

        res.status(200).json({ message: 'Task timer has been reset and project total time adjusted.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


