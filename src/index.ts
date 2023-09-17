import express from "express";
import bodyParser from "body-parser";
import movieRouter from "./routers/movieRouter.js";
import authRouter from "./routers/authRoutes.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import mongoose from "mongoose";
import dotenv from "dotenv";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";
const PORT = process.env.PORT || "7878";

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json()); // Middleware to parse JSON request bodies

app.use(express.static("static")); // Serve static files from the "static" directory

app.use(fileUpload()); // Middleware for handling file uploads

app.use("/api", movieRouter); // Mount the movieRouter for routes starting with "/api"

app.use("/auth", authRouter); // Mount the authRouter for authentication-related routes

app.use(express.json()); // Parse JSON request bodies

app.use(errorMiddleware); // Custom error-handling middleware

const startApp = async () => {
  try {
    mongoose.set("strictQuery", true); // Enable strict query mode for Mongoose
    await mongoose.connect(MONGO_URI);
    console.log("Successfully connected to the database");

    app.listen(PORT, () => {
      if (process.env.NODE_ENV == "prod") {
        console.log(`Server is running in production mode on port ${PORT}`);
      } else {
        console.log(`Server is running in development mode on port ${PORT}`);
      }
    });
  } catch (err) {
    console.log("Error connecting to the database", err);
  }
};

startApp();
