import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./src/app.js";
import { startLeaveCleanupJob } from "./src/jobs/leaveCleanup.job.js";
dotenv.config();
const PORT = process.env.PORT;

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("MongoDB Connected");
		const intervalMinutes = Number(
			process.env.LEAVE_CLEANUP_INTERVAL_MINUTES || 60,
		);
		startLeaveCleanupJob(intervalMinutes);
		app.listen(PORT, "0.0.0.0", () =>
			console.log(`Server running on port ${PORT}`),
		);
	})
	.catch((err) => console.log(err));

app.get("/", async (req, res) => {
	res.status(200).json({
		message: "Welcome to Dormex API",
	});
});
