import cors from "cors";
import express, { json } from "express";
import helmet from "helmet";
import morgan from "morgan";

import adminStudentRoutes from "./routes/admin-student.routes.js";
import authRoutes from "./routes/auth.routes.js";
import blockRoutes from "./routes/block.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import joinBlockRoutes from "./routes/joinBlock.routes.js";
import leaveRoutes from "./routes/leave.routes.js";
import messRoutes from "./routes/mess.routes.js";
import roomRoutes from "./routes/room.routes.js";
import studentRoutes from "./routes/student.routes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(json());

app.use("/api/auth", authRoutes);
app.use("/api/blocks", blockRoutes);
app.use("/api/joinBlock", joinBlockRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/mess", messRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin-students", adminStudentRoutes);

export default app;
