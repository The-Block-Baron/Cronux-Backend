import Project from "../models/projectModel";

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
                    "tasks.$[].timerRunning": false,     
                    "tasks.$[].timerStartedAt": null,
                    "tasks.$[].totalTimeSpent": 0,
                    "tasks.$[].timeEntries": [],
                    "tasks.$[].value": '00:00:00',
                    "tasks.$[].totalValue": '00:00:00'
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
