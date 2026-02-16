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
