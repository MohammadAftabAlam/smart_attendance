import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: () => new Date().setHours(0, 0, 0, 0), // Date without time
        required: true
    },
    present: {
        type: Date,
        required: false
    },
    absent: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Prevent duplicates
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);



// import mongoose from "mongoose";

// const attendanceSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     present: {
//         type: Date,
//         default: Date.now,
//         required: true
//     },
//     absent: {
//         type: Date,
//         required: true
//     }
// },
//     { timestamps: true });

// export const Attendance = mongoose.model('Attendance', attendanceSchema);