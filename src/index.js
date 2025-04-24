import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
})
import connectDB from "./db/server.js";
import { app } from './app.js';
import { markAutoAbsent } from "./services/autoAbsentMarking.services.js";

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log(`Error: `, error);
        })

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port: ${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.log("MongoDB connection failed !!! ", error);
    });



// Start cron job when server starts
markAutoAbsent.start();