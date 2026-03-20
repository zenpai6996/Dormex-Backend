import bcrypt from "bcryptjs";
import Complaint from "../models/Complaint.js";
import User from "../models/User.js";

const { compare, hash } = bcrypt;

// Generate a random password
function generatePassword() {
	const length = 10;
	const charset =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
	let password = "";
	for (let i = 0; i < length; i++) {
		password += charset.charAt(Math.floor(Math.random() * charset.length));
	}
	return password;
}

// Create student by admin
export const createStudentByAdmin = async (req, res) => {
	try {
		const {
			name,
			email,
			rollNo,
			dateOfBirth,
			phoneNumber,
			branch,
			blockId,
			generateRandomPassword,
		} = req.body;

		// Check if email exists
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ message: "Email already exists" });
		}

		// Check if roll number exists
		const existingRollNo = await User.findOne({ rollNo });
		if (existingRollNo) {
			return res.status(400).json({ message: "Roll number already exists" });
		}

		// Generate password
		const plainPassword = generateRandomPassword
			? generatePassword()
			: req.body.password;
		const hashedPassword = await hash(plainPassword, 10);

		// Create student
		const student = await User.create({
			name,
			email,
			password: hashedPassword,
			rollNo,
			dateOfBirth: new Date(dateOfBirth),
			phoneNumber,
			branch,
			role: "STUDENT",
			status: "ACTIVE",
			joiningDate: new Date(),
			block: blockId || null,
		});

		// Return student data without password
		const studentData = student.toObject();
		delete studentData.password;

		res.status(201).json({
			message: "Student created successfully",
			student: studentData,
			// Return the plain password only if generated
			password: generateRandomPassword ? plainPassword : undefined,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Get all students with filters
export const getAllStudents = async (req, res) => {
	try {
		const { branch, block, status, search } = req.query;

		let query = { role: "STUDENT" };

		if (branch) query.branch = branch;
		if (block) query.block = block;
		if (status) query.status = status;

		// Search by name, email, or rollNo
		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ email: { $regex: search, $options: "i" } },
				{ rollNo: { $regex: search, $options: "i" } },
			];
		}

		const students = await User.find(query)
			.select("-password")
			.populate("block", "name")
			.populate("room", "roomNumber")
			.sort({ createdAt: -1 });

		res.json(students);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Update student by admin
export const updateStudentByAdmin = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body;

		// Remove sensitive fields
		delete updates.password;
		delete updates.role;

		const student = await User.findByIdAndUpdate(id, updates, { new: true })
			.select("-password")
			.populate("block", "name")
			.populate("room", "roomNumber");

		if (!student) {
			return res.status(404).json({ message: "Student not found" });
		}

		res.json(student);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Delete student by admin with password confirmation
export const deleteStudentByAdmin = async (req, res) => {
	try {
		const { id } = req.params;
		const { password } = req.body;

		if (!password) {
			return res.status(400).json({ message: "Password is required" });
		}

		const admin = await User.findById(req.user.id);
		if (!admin) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const isValid = await compare(password, admin.password);
		if (!isValid) {
			return res.status(401).json({ message: "Invalid password" });
		}

		const student = await User.findById(id);
		if (!student || student.role !== "STUDENT") {
			return res.status(404).json({ message: "Student not found" });
		}

		if (student.block || student.room) {
			return res.status(400).json({
				message: "Student must be unassigned from block and room before deletion",
			});
		}

		await Complaint.deleteMany({
			student: student._id,
			block: { $ne: null },
		});

		await User.findByIdAndDelete(student._id);

		res.json({ message: "Student deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Bulk create students
export const bulkCreateStudents = async (req, res) => {
	try {
		const { students } = req.body;

		const createdStudents = [];
		const errors = [];

		for (const studentData of students) {
			try {
				// Check duplicates
				const existing = await User.findOne({
					$or: [{ email: studentData.email }, { rollNo: studentData.rollNo }],
				});

				if (existing) {
					errors.push({
						email: studentData.email,
						rollNo: studentData.rollNo,
						error: "Email or Roll No already exists",
					});
					continue;
				}

				// Generate password
				const plainPassword = generatePassword();
				const hashedPassword = await hash(plainPassword, 10);

				const student = await User.create({
					...studentData,
					password: hashedPassword,
					role: "STUDENT",
					status: "ACTIVE",
					joiningDate: new Date(),
					dateOfBirth: new Date(studentData.dateOfBirth),
				});

				const studentObj = student.toObject();
				delete studentObj.password;

				createdStudents.push({
					...studentObj,
					generatedPassword: plainPassword,
				});
			} catch (err) {
				errors.push({
					...studentData,
					error: err.message,
				});
			}
		}

		res.status(201).json({
			message: `Created ${createdStudents.length} students`,
			created: createdStudents,
			errors: errors,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
