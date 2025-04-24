import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {markPresent, getUserAttendance } from "../controllers/attendance.controller.js";

const router = express.Router();

router.post("/present", verifyJWT, markPresent); // mark present
// router.post("/absent", verifyJWT, markAbsent); // mark absent

// router.get('/present', (req, res) => {
//     res.send("Attendance is working")
// })

router.route('/attendance-details').get(verifyJWT, getUserAttendance);     // GET /api/v1/mark-attendance - Get records


export default router;  