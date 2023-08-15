import mongoose from "mongoose";

const timeEntrySchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    milliseconds: {
        type: Number,
        default: 0
    }
});


const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['doing', 'done', 'to do'],
        default: 'to do'
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        default: function() {
            const trackingMethod = this.parent().trackingMethod; 

            switch (trackingMethod) {
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
    timerRunning: {
        type: Boolean,
        default: function() {
            return this.parent().trackingMethod === 'timeInput' ? false : undefined;
        }
    },
    timerStartedAt: {
        type: Date,
        default: function() {
            return this.parent().trackingMethod === 'timeInput' ? null : undefined;
        }
    },
    timeEntries: {
        type: [timeEntrySchema],
        default: function() {
            return this.parent().trackingMethod === 'timeInput' ? [] : undefined;
        }
    },
    totalTimeSpent: {
        type: Number,
        default: function() {
            return this.parent().trackingMethod === 'timeInput' ? 0 : undefined;
        }
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
    tasks: [taskSchema],
    timerRunning: {
        type: Boolean,
        default: function() {
            return this.trackingMethod === 'timeInput' ? false : undefined;
        }
    },
    timerStartedAt: {
        type: Date,
        default: function() {
            return this.trackingMethod === 'timeInput' ? null : undefined;
        }
    },
    timeEntries: {
        type: [timeEntrySchema], // reutilizamos el timeEntrySchema que definimos anteriormente
        default: function() {
            return this.trackingMethod === 'timeInput' ? [] : undefined;
        }
    },
    totalTimeSpent: {
        type: Number, // Total de milisegundos a nivel de proyecto
        default: function() {
            return this.trackingMethod === 'timeInput' ? 0 : undefined;
        }
    }
});


const Project = mongoose.model('Project', projectSchema)

export default Project;
