import { Attendance } from "../models/attendance.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const markPresent = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already marked today
    const existing = await Attendance.findOne({
        user: userId,
        date: today
    });

    if (existing) {
        throw new ApiError(400, "Attendance already marked today");
    }

    await Attendance.create({
        user: userId,
        date: today,
        present: new Date() // Current timestamp
    });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Present marked successfully"));
});



// import { Attendance } from "../models/attendance.model.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// // Mark user as PRESENT
// const markPresent = asyncHandler(async (req, res) => {
//     const userId = req.user._id;

//     // Check if already marked present today
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const existingRecord = await Attendance.findOne({
//         user: userId,
//         present: { $gte: today }
//     });

//     if (existingRecord) {
//         throw new ApiError(400, "Attendance already marked for today");
//     }

//     // Create new record
//     const attendance = await Attendance.create({
//         user: userId,
//         present: new Date() // Current timestamp
//     });

//     return res
//         .status(201)
//         .json(new ApiResponse(201, attendance, "Marked present successfully"));
// });

// // Mark user as ABSENT
// const markAbsent = asyncHandler(async (req, res) => {
//     const userId = req.user._id;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const existingRecord = await Attendance.findOne({
//         user: userId,
//         absent: { $gte: today }
//     });

//     if (existingRecord) {
//         throw new ApiError(400, "Absence already marked for today");
//     }

//     const attendance = await Attendance.create({
//         user: userId,
//         absent: new Date()
//     });

//     return res
//         .status(201)
//         .json(new ApiResponse(201, attendance, "Marked absent successfully"));
// });

// Get all attendance records for the user
const getUserAttendance = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const attendance = await Attendance.find({ user: userId })
        .sort({ createdAt: -1 }) // Newest first
        .select("-__v -updatedAt");

    return res
        .status(200)
        .json(new ApiResponse(200, attendance, "Attendance records fetched"));
});

export { markPresent, getUserAttendance };