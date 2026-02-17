import cors from "cors";
import express, { json } from "express";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import messRoutes from "./routes/mess.routes.js";
import roomRoutes from "./routes/room.routes.js";
import studentRoutes from "./routes/student.routes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(json());

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/mess", messRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;
