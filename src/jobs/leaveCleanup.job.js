import Complaint from "../models/Complaint.js";
import LeaveApplication from "../models/LeaveApplication.js";

const DAY_MS = 24 * 60 * 60 * 1000;

const getExpiryDate = (baseDate = new Date()) => {
	return new Date(baseDate.getTime() + 7 * DAY_MS);
};

export const runLeaveCleanup = async () => {
	const now = new Date();
	const expiresAt = getExpiryDate(now);

	await LeaveApplication.updateMany(
		{
			status: "PENDING",
			fromDate: { $lt: now },
			expiresAt: null,
		},
		{
			status: "REJECTED",
			expiresAt,
			approvedAt: null,
		},
	);

	await LeaveApplication.updateMany(
		{
			status: { $in: ["APPROVED", "REJECTED"] },
			expiresAt: null,
		},
		{
			expiresAt,
		},
	);

	await LeaveApplication.deleteMany({ expiresAt: { $lte: now } });

	await Complaint.updateMany(
		{
			status: "RESOLVED",
			expiresAt: null,
		},
		{
			expiresAt,
			resolvedAt: now,
		},
	);

	await Complaint.deleteMany({ expiresAt: { $lte: now } });
};

export const startLeaveCleanupJob = (intervalMinutes = 60) => {
	const intervalMs = Math.max(5, intervalMinutes) * 60 * 1000;

	runLeaveCleanup().catch((err) => {
		console.error("Leave cleanup job failed", err);
	});

	setInterval(() => {
		runLeaveCleanup().catch((err) => {
			console.error("Leave cleanup job failed", err);
		});
	}, intervalMs);
};
