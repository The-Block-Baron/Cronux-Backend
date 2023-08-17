import User from "../models/userModel.js";
import Project from "../models/projectModel.js";

export const readProject = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('projects');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ projects: user.projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createProject = async (req, res) => {
    const {name} = req.body;

    if(!name ) {
        return res.status(400).json({message: "Name is required"});
    }

    try {
        const project = new Project({ name, trackingMethod: 'timeInput' });
        await project.save()
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.projects.push(project._id);
        await user.save();

        res.status(201).json({ message: 'Project created successfully', project });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}


export const updateProject = async (req, res) => {
    const { projectId } = req.params;
    const { name, value, totalValue, status } = req.body;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (value && !/^(\d{2}):(\d{2}):(\d{2})$/.test(value)) {
            return res.status(400).json({ message: 'Value must be in HH:MM:SS format for timeInput' });
        }
        
        if (totalValue && !/^(\d{2}):(\d{2}):(\d{2})$/.test(totalValue)) {
            return res.status(400).json({ message: 'TotalValue must be in HH:MM:SS format for timeInput' });
        }

        if (status && !['doing', 'done', 'to do'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided' });
        }

        if (name) project.name = name;
        if (value) project.value = value;
        if (totalValue) project.totalValue = totalValue;
        if (status) project.status = status;

        await project.save();

        res.status(200).json({ message: 'Project updated successfully', project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const deleteProject = async(req, res ) => {
    const {projectId} = req.params 

    try {
        const project = await Project.findById(projectId)

        if(!project) {
            return res.status(404).json({message: "Project not found"})
        }

        const userId = req.user.id
        const user = await User.findById(userId)

        if(!user || !user.projects.includes(projectId)){
            return res.status(403).json({message:"Not authorized to delete this project"})
        }

        await Project.findByIdAndDelete(projectId)

        user.projects = user.projects.filter(pId => pId.toString() !== projectId.toString())

        await user.save()

        res.status(200).json({message: "Project deleted succesfully"})
    } catch(error) {
        res.status(500).json({message: error.message})
    }
}