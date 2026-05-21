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
import adminRouter from "./routes/adminRoute.js";
import dns from "dns";

// ================= DNS FIX =================
dns.setServers(["8.8.8.8", "8.8.4.4"]);
// ===========================================

dotenv.config();

const app = express();

// Enable CORS
app.use(cors());

app.use(bodyParser.json());
app.use(requestLogger);

const mongoUrl = process.env.MONGODB_URL;
console.log`🔗 MongoDB URL: ${mongoUrl}🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴`;

// MongoDB Connection
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((error) => {
    console.log("❌ Connection Error Occurred", error);
  });

// Middleware
app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  const rawIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const ip = rawIp?.split(",")[0].trim();

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = decoded;
      req.clientIp = ip;

      console.log("✅ Authenticated User IP:", ip);

      next();
    });
  } else {
    req.clientIp = ip;

    console.log("✅ Client IP:", ip);

    next();
  }
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/pets", petRouter);
app.use("/api/otp", otpRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/products", productRouter);
app.use("/api/medical", medicalHistoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/admin", adminRouter);

const port = process.env.PORT || 5002;

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`🔗 MongoDB URL: ${mongoUrl}🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴`);
});