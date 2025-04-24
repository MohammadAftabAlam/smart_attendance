import mongoose from "mongoose";

const presentAttendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    checkIn: {
        type: Date,
        default: Date.now,
        required: true
    },
    // Additional present-specific fields
    location: {
        type: String,
        required: false // Optional
    },
    deviceInfo: {
        type: String
    }
}, { timestamps: true });

export const PresentAttendance = mongoose.model('PresentAttendance', presentAttendanceSchema);