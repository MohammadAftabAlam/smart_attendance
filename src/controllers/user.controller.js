
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js'
import { User } from "../models/user.model.js"
import { ApiResponse } from '../utils/ApiResponse.js';

import bcrypt from 'bcrypt';


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSafe: false });       //saving user refresh token without validating since we have validated user earlier

        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new ApiError(500, "Something went wrong generating refresh and access token");
    }
}


const registerUser = asyncHandler(async (req, res) => {

    // Get user details from frontend such as name, age, gender, email, password 
    // Validation - Non Empty
    // check user already exists: By username or email
    // Check for images, check for avatar
    // Upload them on cloudinary, Check avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return res

    const { fullName, email, password } = req.body
    // console.log("fullName: ", fullName)
    // console.log("Email: ", email)
    // console.log("\nreq.files\n\n", req.files)

    if (fullName === "") {
        throw new ApiError(400, "fullname is required")
    }

    if ([fullName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne(
        {
            // checking whether the same username or email exist in db or not. // $ is a operator that helps to access the methods like and, or, etc.. The working of the "or", "and" is just like of Digital Electornics things
            // $or: [{ username }, { email }]
            email
        })

    if (existedUser) {
        throw new ApiError(409, "User with username or email already registered")
    }

    // create user object in database
    const user = await User.create({
        fullName,         // if coverImage is present then give the url otherwise store it as Null
        email,
        password,
        // username: username.toLowerCase(),
    })

    //checking whether the user is created inside db 
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"       //removing password and refreshToken from response
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
});


const loginUser = asyncHandler(async (req, res) => {
    // req.body -> data
    // username or email
    // find the user
    // Validate password
    // access and refresh token
    // send cookie


    // Destructuring req.body of the user
    const { email, password } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    // Finding user in db
    const user = await User.findOne({ email })

    // Raising erro since user is not inside the db
    if (!user) {
        throw new ApiError(404, "User doesn't exist");
    }

    // Validating user password
    if (!password) {
        throw new ApiError(400, "Paswrod is not present there")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    // If user password is wrong
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User credentials");
    }


    // Generating accessToken and refreshToken 
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);


    // Updating refreshToken inside the db
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // By this cookie will be modified by server only
    const options = {
        httpOnly: true,
        secure: true
    }

    // Sending cookies
    res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                { user: loggedInUser, refreshToken, accessToken },
                "User logged In Successfully")
        );
});


const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: { refreshToken: undefined }
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "User logged out Successfully")
        );
});

const getUserDetails = asyncHandler(async (req, res) => {
    const userId = req.user?._id; // From `verifyJWT` middleware

    if (!userId) {
        throw new ApiError(401, "Unauthorized: User not logged in");
    }

    // Fetch user (exclude sensitive fields)
    const user = await User.findById(userId).select(
        "-password -refreshToken -__v"
    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User details fetched successfully"));
});


const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id; // From auth middleware

    // 1. Validate input
    if (!currentPassword || !newPassword) {
        throw new ApiError(400, "Both current and new passwords are required");
    }

    if (currentPassword === newPassword) {
        throw new ApiError(400, "New password must be different from current password");
    }

    // 2. Find user
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // 3. Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Current password is incorrect");
    }

    // 4. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);

    // 5. Update password
    user.password = hashedPassword;
    await user.save({ validateBeforeSave: false });

    // 6. Invalidate old tokens (optional)
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export { registerUser, loginUser, logoutUser, getUserDetails, changePassword }