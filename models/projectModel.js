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



const Project = mongoose.model('Project', projectSchema)

export default Project;
