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
    const {name, trackingMethod} = req.body;

    if(!name || !trackingMethod ) {
        return res.status(400).json({message: "Name and trackingMethod are required"});
    }

    if(!['selectOptions', 'checkbox', 'timeInput'].includes(trackingMethod)) {
        return res.status(400).json({message: "Invalid tracking method"});
    }

    try {
        const project = new Project({ name, trackingMethod });
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
    const { name, trackingMethod, value } = req.body;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (trackingMethod) {
            if (!['selectOptions', 'checkbox', 'timeInput'].includes(trackingMethod)) {
                return res.status(400).json({ message: "Invalid tracking method" });
            }

            if (value) {
                if (trackingMethod === 'selectOptions' && !Array.isArray(value)) {
                    return res.status(400).json({ message: 'Value must be an array for selectOptions' });
                } else if (trackingMethod === 'checkbox' && typeof value !== 'boolean') {
                    return res.status(400).json({ message: 'Value must be a boolean for checkbox' });
                } else if (trackingMethod === 'timeInput' && !/^(\d{2}):(\d{2}):(\d{2})$/.test(value)) {
                    return res.status(400).json({ message: 'Value must be in HH:MM:SS format for timeInput' });
                }
            }
        }
        if (name) project.name = name;
        if (trackingMethod) {
            project.trackingMethod = trackingMethod;
            if (!value) {
                switch (trackingMethod) {
                    case 'selectOptions':
                        project.value = [];
                        break;
                    case 'checkbox':
                        project.value = false;
                        break;
                    case 'timeInput':
                        project.value = '00:00:00';
                        break;
                    default:
                        project.value = null;
                }
            } else {
                project.value = value;
            }
        }

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