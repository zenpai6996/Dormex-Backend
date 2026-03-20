import LeaveApplication from "../models/LeaveApplication.js";
import User from "../models/User.js";

const parseDate = (value) => {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return null;
	return date;
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

		const updates = { status };

		if (status === "APPROVED") {
			const approvedAt = new Date();
			updates.approvedAt = approvedAt;
			updates.expiresAt = new Date(
				approvedAt.getTime() + 7 * 24 * 60 * 60 * 1000,
			);
		} else {
			updates.approvedAt = null;
			updates.expiresAt = null;
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
