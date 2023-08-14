import User from "../models/userModel.js";
import Project from "../models/projectModel.js";

export const createProject = async (req, res) => {
    const {name, trackingMethod, value} = req.body;

    if(!name || !trackingMethod ) {
        return res.status(400).json({message: "Name and trackingMethod are required"});
    }

    if(!['selectOptions', 'checkbox', 'timeInput'].includes(trackingMethod)) {
        return res.status(400).json({message: "Invalid tracking method"});
    }

    try {
        const project = new Project({ name, trackingMethod, value });
        await project.save();

        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Añadir el proyecto al usuario y guardar
        user.projects.push(project._id);
        await user.save();

        res.status(201).json({ message: 'Project created successfully', project });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

