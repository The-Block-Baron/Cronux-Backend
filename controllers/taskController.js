import Project from "../models/projectModel.js";

export const createTask = async (req, res) => {
    const { projectId } = req.params;
    const { description, priority, tags } = req.body; 

    const validPriorities = ['Immediate', 'Ongoing', 'Future'];
    if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority value' });
    }

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const newTask = { 
            description, 
            priority: priority || 'Ongoing', 
            tags: Array.isArray(tags) ? tags : []  
        };
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
    const { description, status, value, totalValue, tags, priority } = req.body;

    const validPriorities = ['Immediate', 'Ongoing', 'Future'];
    if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority value' });
    }

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const task = project.tasks.id(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (value && !/^(\d{2}):(\d{2}):(\d{2})$/.test(value)) {
            return res.status(400).json({ message: 'Value must be in HH:MM:SS format for timeInput' });
        }

        if (totalValue && !/^(\d{2}):(\d{2}):(\d{2})$/.test(totalValue)) {
            return res.status(400).json({ message: 'TotalValue must be in HH:MM:SS format for timeInput' });
        }

        if (status && !['doing', 'done', 'to do'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        if (description) task.description = description;
        if (status) task.status = status;
        if (value) task.value = value;
        if (totalValue) task.totalValue = totalValue; 

        if (tags) task.tags = tags;
        if (priority) task.priority = priority;

        await project.save();

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
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
