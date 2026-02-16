import User from "../models/User.js";

export const getStudents = async (req, res) => {
	const students = await User.find({ role: "STUDENT" }).select("-password");
	res.json(students);
};

export const getStudentById = async (req, res) => {
	const student = await User.findById(req.params.id).select("-password");
	if (!student) return res.status(404).json({ message: "Student not found" });
	res.json(student);
};

export const updateStudent = async (req, res) => {
	const student = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	}).select("-password");

	res.json(student);
};

export const deleteStudent = async (req, res) => {
	await User.findByIdAndDelete(req.params.id);
	res.json({ message: "Student deleted" });
};
