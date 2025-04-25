import { Router } from 'express';
const router = Router();

import {changePassword, getUserDetails, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

router.route('/register').post(
    registerUser
);

router.route('/login').post(loginUser);


// Secured Route
router.route('/logout').post(verifyJWT, logoutUser);

// router.route("/mark-attendance").post(verifyJWT, markAttendance);
router.route("/user-details").get(verifyJWT,getUserDetails)

router.route('/change-password').post(verifyJWT, changePassword)

export default router   