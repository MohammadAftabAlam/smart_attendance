import mongoose from "mongoose";

const absentAttendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: () => new Date().setHours(0, 0, 0, 0) // Store date only
    },
    reason: {
        type: String,
        enum: ['Sick', 'Leave', 'Other'],
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const AbsentAttendance = mongoose.model('AbsentAttendance', absentAttendanceSchema);