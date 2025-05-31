import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRouter from "./routes/userRoute.js";
import jwt from "jsonwebtoken";
import doctorRouter from "./routes/doctorRoute.js";
import petRouter from "./routes/petRoute.js";
import otpRouter from "./routes/otpRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import productRouter from "./routes/productRoute.js";
import medicalHistoryRouter from "./routes/medicalHistoryRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { requestLogger } from "./utils.js/userTracking.js";
import cors from "cors";
// import jwt from "jsonwebtoken";

dotenv.config();
const app = express();

// Enable CORS
app.use(cors());

app.use(bodyParser.json());
app.use(requestLogger);

const mongoUrl = process.env.MONGODB_URL;

mongoose.connect(mongoUrl, {});
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("database connetced");
});

app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const rawIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const ip = rawIp.split(",")[0].trim(); // Use the first IP if there are multiple

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (error) {
        // If token is invalid, send a 401 Unauthorized response
        return res.status(401).json({ message: "Unauthorized" });
      }

      // If token is valid, attach decoded data to req.user

      req.user = decoded;
      req.clientIp = ip; // ✅ Save IP to request object (optional)
      console.log("✅ Authenticated User IP:", ip);

      next(); // Continue to the next middleware/route handler
    });
  } else {
    // No token is present, just continue to the next middleware/route handler
    req.clientIp = ip; // ✅ Save IP to request object (optional)
    console.log("✅ Authenticated User IP:", ip);
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

// MIAN ROUTES---------------------------------------------------------->

app.use("/api/users", userRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/pets", petRouter);
app.use("/api/otp", otpRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/products", productRouter);
app.use("/api/medical", medicalHistoryRouter);
app.use("/api/orders", orderRouter);

const port = process.env.port;

app.listen(port, () => {
  console.log(`Server is running port : ${5000}`);
});
