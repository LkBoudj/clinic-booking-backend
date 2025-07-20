import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import errorHandler from "./core/middlewares/error.middleware";
import rootRouter from "./routers";
import passport from "./config/passport.config";

dotenv.config();

const app = express();

// app.use(mongoSanitize());

app.use(helmet());
app.use(hpp());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // حد أقصى لكل IP
  message: "تم تجاوز الحد المسموح للطلبات، الرجاء المحاولة لاحقًا",
});
app.use(limiter);

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", rootRouter);
app.use(errorHandler);
export default app;
