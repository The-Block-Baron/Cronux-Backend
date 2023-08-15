import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['doing', 'done', 'to do'],
        default: 'to do'
    },
    timer: {
        type: String,
        required: true,
        default: '00:00:00'
    }
});


const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    trackingMethod: {
        type: String,
        required: true,
        enum: ['selectOptions', 'checkbox', 'timeInput'],
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        default: function() {
            switch (this.trackingMethod) {
                case 'selectOptions':
                    return [];
                case 'checkbox':
                    return false;
                case 'timeInput':
                    return '00:00:00';
                default:
                    return null;
            }
        }
    },
    taks: [taskSchema]
})

const Project = mongoose.model('Project', projectSchema)

export default Project;
