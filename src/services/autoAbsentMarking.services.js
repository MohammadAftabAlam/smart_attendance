import { Attendance } from "../models/attendance.model.js";
import cron from "node-cron";

// Runs daily at 11:59 PM
const markAutoAbsent = cron.schedule('59 23 * * *', async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find users who didn't mark present today
        const usersWithoutAttendance = await User.aggregate([
            {
                $lookup: {
                    from: "attendances",
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$user", "$$userId"] },
                                        { $eq: ["$date", today] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "attendance"
                }
            },
            {
                $match: {
                    attendance: { $size: 0 } // No attendance record
                }
            }
        ]);

        // Mark absent
        await Promise.all(
            usersWithoutAttendance.map(user =>
                Attendance.create({
                    user: user._id,
                    date: today,
                    absent: true
                })
            )
        );

        console.log(`Auto-marked absent for ${usersWithoutAttendance.length} users`);
    } catch (error) {
        console.error("Auto-absent marking failed:", error);
    }
});

export { markAutoAbsent };