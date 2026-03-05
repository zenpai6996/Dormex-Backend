import Complaint from "../models/Complaint.js";

export const createComplaint = async (req, res) => {
	const complaint = await Complaint.create({
		...req.body,
		student: req.user.id,
	});
	res.status(201).json(complaint);
};

export const getComplaints = async (req, res) => {
	const complaints =
		req.user.role === "ADMIN"
			? await Complaint.find().populate("student", "-password")
			: await Complaint.find({ student: req.user.id });

	res.json(complaints);
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
