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
        type: String,
        required: true,
        default: '00:00:00'  
    },
    totalValue: {
        type: String,
        default: '00:00:00'  
    },
    tags: {
        type: [String],
        default: []
    },
    priority: {
        type: String,
        enum: ['Immediate', 'Ongoing', 'Future'],
        default: 'Ongoing'
    },
    timerRunning: {
        type: Boolean,
        default: false  
    },
    timerStartedAt: {
        type: Date,
        default: null 
    },
    timeEntries: {
        type: [timeEntrySchema], 
        default: []  
    },
    totalTimeSpent: {
        type: Number, 
        default: 0  
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
        enum: ['timeInput'],  
        default: 'timeInput'
    },
    value: {
        type: String,
        required: true,
        default: '00:00:00'  
    },
    totalValue: {
        type: String,
        default: '00:00:00'  
    },    
    status: {
        type: String,
        enum: ['doing', 'done', 'to do'],
        default: 'to do'
    },
    tags: {
        type: [String],
        default: []
    },
    priority: {
        type: String,
        enum: ['Immediate', 'Ongoing', 'Future'],
        default: 'Ongoing'
    },
    streak: {
        type: Number,
        default: 0
    },
    tasks: [taskSchema],
    timerRunning: {
        type: Boolean,
        default: false  
    },
    timerStartedAt: {
        type: Date,
        default: null  
    },
    timeEntries: {
        type: [timeEntrySchema], 
        default: [] 
    },
    totalTimeSpent: {
        type: Number, 
        default: 0 
    },
});

projectSchema.statics.calculateStreak = function(timeEntries) {
    if (!timeEntries || timeEntries.length === 0) {
        return 0;
    }

    let streak = 1; 
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    let lastEntryDate = new Date(timeEntries[timeEntries.length - 1].date);
    lastEntryDate.setHours(0, 0, 0, 0);

    if ((currentDate - lastEntryDate) / (1000 * 60 * 60 * 24) > 1) {
        return 0;  
    }

    timeEntries.pop(); 
    currentDate.setDate(currentDate.getDate() - 1);

    while (timeEntries.length) {
        lastEntryDate = new Date(timeEntries[timeEntries.length - 1].date);
        lastEntryDate.setHours(0, 0, 0, 0);

        if ((currentDate - lastEntryDate) / (1000 * 60 * 60 * 24) === 0) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
            timeEntries.pop();
        } else {
            break;
        }
    }

    return streak;
}




const Project = mongoose.model('Project', projectSchema)

export default Project;
