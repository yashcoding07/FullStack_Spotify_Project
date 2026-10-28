import express from "express";
import musicRoutes from "./routes/music.routes.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/api/music", musicRoutes);

export default app;
