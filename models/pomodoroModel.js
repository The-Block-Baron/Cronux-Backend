const mongoose = require('mongoose');

const pomodoroSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project' 
    }, 
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: Date,
    status: {
        type: String,
        enum: ['ongoing', 'paused', 'completed', 'stopped'],
        default: 'ongoing'
    },
    tandas: { 
        type: Number, 
        default: 1, 
        min: 1, 
        max: 6 
    }, 
    tandaActual: { 
        type: Number, 
        default: 1 
    },
    totalDuration: { 
        type: Number, 
        default: 25 * 60 * 1000 
    }, 
    breakDuration: { 
        type: Number, 
        default: 5 * 60 * 1000 
    }, 
});

module.exports = mongoose.model('Pomodoro', pomodoroSchema);
