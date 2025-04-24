// import { Attendance } from "../models/attendance.model.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// /**
//  * Middleware to mark attendance:
//  * - Checks if the user has already marked attendance today.
//  * - If not, creates a new attendance record.
//  */

// export const markAttendance = asyncHandler(async (req, res) => {
//     const userId = req.user?._id; // From auth middleware

//     if (!userId) {
//         throw new ApiError(401, "Unauthorized: User not logged in");
//     }

//     // Get today's date (start of day)
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Sets time to 00:00:00

//     // Check if attendance already exists for today
//     const existingAttendance = await Attendance.findOne({
//         user: userId,
//         date: {
//             $gte: today, // After start of today
//             $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Before next day
//         },
//     });

//     if (existingAttendance) {
//         throw new ApiError(400, "Attendance already marked for today");
//     }

//     // If no existing attendance, create a new record
//     const attendance = await Attendance.create({
//         user: userId,
//         date: new Date(), // Current timestamp
//         checkIn: new Date(), // Time of marking attendance
//         status: "Present", // Can be "Late" if you add time checks later
//     });

//     // Return success response
//     return res
//         .status(200)
//         .json(new ApiResponse(200, attendance, "Attendance marked successfully"));
// });

// export default markAttendance