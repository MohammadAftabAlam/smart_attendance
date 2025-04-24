import express from 'express';
const app = express();

import cors from 'cors';
import cookieParser from 'cookie-parser'


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

// Accepting data in the form of Json from the user
app.use(express.json({ limit: "16kb" }))

// Accepting data in the form of URL from the user
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

// Accepting data in the form of PDF/images and etc from the user and saving on our own server.. There is a folder named as public that is used to store the pdf or images.
app.use(express.static("public"))

// Reading cookie from user's website and performing crud operation on it
app.use(cookieParser())


// Routes Importing here for the segregation of the code
import userRouter from './routes/user.routes.js'
import attendanceRouter from './routes/attendance.route.js'

// Routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/user/attendance", attendanceRouter)


// export default app;    // perform Like this 
export { app }   // or like this, both are same