import Complaint from "../models/Complaint.js";
import User from "../models/User.js";

export const createComplaint = async (req, res) => {
	try {
		// Get the student with their block information
		const student = await User.findById(req.user.id)
			.populate("block")
			.populate("room");

		// Check if student exists
		if (!student) {
			return res.status(404).json({ message: "Student not found" });
		}

		// Check if student has joined a block
		if (!student.block) {
			return res.status(403).json({
				message: "You must join a block before filing a complaint",
			});
		}

		// Check if student has joined a room
		if (!student.room) {
			return res.status(403).json({
				message: "You must join a room before filing a complaint",
			});
		}

		// Check if student status is ACTIVE
		if (student.status !== "ACTIVE") {
			return res.status(403).json({
				message: "Only active students can file complaints",
			});
		}

		// Create the complaint with student's block info
		const complaint = await Complaint.create({
			...req.body,
			student: req.user.id,
			block: student.block._id,
			room: student.room._id,
		});

		res.status(201).json(complaint);
	} catch (err) {
		console.error("Create complaint error:", err);
		res.status(500).json({ message: err.message });
	}
};

export const getComplaints = async (req, res) => {
	try {
		if (req.user.role === "ADMIN") {
			const complaints = await Complaint.find()
				.populate({
					path: "student",
					select: "-password",
					populate: [
						{ path: "block", select: "name" },
						{ path: "room", select: "roomNumber" },
					],
				})
				.populate("block", "name")
				.sort({ createdAt: -1 });

			// Add debug log
			console.log(
				"Complaints with blocks:",
				JSON.stringify(complaints, null, 2),
			);

			res.json(complaints);
		} else {
			const complaints = await Complaint.find({ student: req.user.id })
				.populate({
					path: "student",
					select: "-password",
					populate: [
						{ path: "block", select: "name" },
						{ path: "room", select: "roomNumber" },
					],
				})
				.populate("block", "name")
				.sort({ createdAt: -1 });
			res.json(complaints);
		}
	} catch (err) {
		console.error("Get complaints error:", err);
		res.status(500).json({ message: err.message });
	}
};

export const updateComplaintStatus = async (req, res) => {
	const complaint = await Complaint.findByIdAndUpdate(
		req.params.id,
		{ status: req.body.status },
		{ new: true },
	);

	res.json(complaint);
};

export const deleteComplaint = async (req, res) => {
	try {
		const { id } = req.params;

		const complaint = await Complaint.findById(id);

		if (!complaint) {
			return res.status(404).json({ message: "Complaint not found" });
		}

		// Check if user is authorized to delete
		if (
			req.user.role !== "ADMIN" &&
			complaint.student.toString() !== req.user.id
		) {
			return res
				.status(403)
				.json({ message: "Unauthorized to delete this complaint" });
		}

		// Optional: Only allow deletion of OPEN complaints for students
		if (req.user.role !== "ADMIN" && complaint.status !== "OPEN") {
			return res.status(400).json({
				message:
					"Cannot delete complaint that is already in progress or resolved",
			});
		}

		await Complaint.findByIdAndDelete(id);

		res.json({ message: "Complaint deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
