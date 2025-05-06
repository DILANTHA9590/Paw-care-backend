import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRouter from "./routes/userRoute.js";
import jwt from "jsonwebtoken";

// import jwt from "jsonwebtoken";

dotenv.config();
const app = express();

app.use(bodyParser.json());

const mongoUrl = process.env.MONGODB_URL;

mongoose.connect(mongoUrl, {});
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("database connetced");
});

app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (error) {
        // If token is invalid, send a 401 Unauthorized response
        return res.status(401).json({ message: "Unauthorized" });
      }

      // If token is valid, attach decoded data to req.user

      req.user = decoded;

      next(); // Continue to the next middleware/route handler
    });
  } else {
    // No token is present, just continue to the next middleware/route handler
    next();
  }
});

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((error) => {
    console.log("Coonnection Error Occured", error);
  });

app.use("/api/users", userRouter);
const port = process.env.port;

app.listen(port, () => {
  console.log(`Server is running port : ${5000}`);
});
