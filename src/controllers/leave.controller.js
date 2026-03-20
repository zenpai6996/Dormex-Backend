import LeaveApplication from "../models/LeaveApplication.js";
import User from "../models/User.js";

const parseDate = (value) => {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return null;
	return date;
};

const getExpiryDate = (baseDate = new Date()) => {
	return new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000);
};

export const createLeave = async (req, res) => {
	try {
		const { fromDate, toDate, reason } = req.body;

		if (!fromDate || !toDate || !reason?.trim()) {
			return res.status(400).json({
				message: "fromDate, toDate and reason are required",
			});
		}

		const parsedFromDate = parseDate(fromDate);
		const parsedToDate = parseDate(toDate);

		if (!parsedFromDate || !parsedToDate) {
			return res.status(400).json({ message: "Invalid date format" });
		}

		if (parsedToDate < parsedFromDate) {
			return res.status(400).json({ message: "toDate must be after fromDate" });
		}

		const student = await User.findById(req.user.id)
			.populate("block")
			.populate("room");

		if (!student) {
			return res.status(404).json({ message: "Student not found" });
		}

		if (!student.block || !student.room) {
			return res.status(403).json({
				message: "You must have a block and room to apply for leave",
			});
		}

		if (student.status !== "ACTIVE") {
			return res.status(403).json({
				message: "Only active students can apply for leave",
			});
		}

		const leave = await LeaveApplication.create({
			student: student._id,
			block: student.block._id,
			room: student.room._id,
			fromDate: parsedFromDate,
			toDate: parsedToDate,
			reason: reason.trim(),
		});

		res.status(201).json(leave);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const getLeaves = async (req, res) => {
	try {
		const { status } = req.query;
		const filter = status ? { status } : {};
		const now = new Date();

		await LeaveApplication.updateMany(
			{
				status: "PENDING",
				fromDate: { $lt: now },
				expiresAt: null,
			},
			{
				status: "REJECTED",
				expiresAt: getExpiryDate(now),
				approvedAt: null,
			},
		);

		if (req.user.role !== "ADMIN") {
			filter.student = req.user.id;
		}

		const leaves = await LeaveApplication.find(filter)
			.populate({
				path: "student",
				select: "-password",
				populate: [
					{ path: "block", select: "name" },
					{ path: "room", select: "roomNumber" },
				],
			})
			.populate("block", "name")
			.populate("room", "roomNumber")
			.sort({ createdAt: -1 });

		res.json(leaves);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const updateLeaveStatus = async (req, res) => {
	try {
		const { status } = req.body;
		const allowed = ["APPROVED", "REJECTED"];

		if (!allowed.includes(status)) {
			return res
				.status(400)
				.json({ message: "Status must be APPROVED or REJECTED" });
		}

		const leave = await LeaveApplication.findById(req.params.id);
		if (!leave) {
			return res.status(404).json({ message: "Leave application not found" });
		}

		const now = new Date();

		if (leave.status === "PENDING" && leave.fromDate < now) {
			const updatedLeave = await LeaveApplication.findByIdAndUpdate(
				leave._id,
				{
					status: "REJECTED",
					approvedAt: null,
					expiresAt: getExpiryDate(now),
				},
				{ new: true },
			)
				.populate({
					path: "student",
					select: "-password",
					populate: [
						{ path: "block", select: "name" },
						{ path: "room", select: "roomNumber" },
					],
				})
				.populate("block", "name")
				.populate("room", "roomNumber");

			return res.json(updatedLeave);
		}

		const updates = { status };
		const expiresAt = getExpiryDate(now);

		if (status === "APPROVED") {
			updates.approvedAt = now;
			updates.expiresAt = expiresAt;
		} else {
			updates.approvedAt = null;
			updates.expiresAt = expiresAt;
		}

		const updatedLeave = await LeaveApplication.findByIdAndUpdate(
			leave._id,
			updates,
			{ new: true },
		)
			.populate({
				path: "student",
				select: "-password",
				populate: [
					{ path: "block", select: "name" },
					{ path: "room", select: "roomNumber" },
				],
			})
			.populate("block", "name")
			.populate("room", "roomNumber");

		res.json(updatedLeave);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
