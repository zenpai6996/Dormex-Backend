import Block from "../models/Block.js";
import User from "../models/User.js";

// export const joinBlock = async (req, res) => {
// 	const { inviteCode } = req.body;

// 	const block = await Block.findOne({ inviteCode });
// 	if (!block) return res.status(404).json({ message: "Invalid code" });

// 	const user = await User.findById(req.user.id);

// 	if (user.block)
// 		return res.status(400).json({ message: "Already joined a block" });

// 	user.block = block._id;
// 	await user.save();

// 	res.json({ message: "Joined block successfully" });
// };

export const joinBlock = async (req, res) => {
	try {
		const { inviteCode } = req.body;

		const block = await Block.findOne({ inviteCode });
		if (!block) return res.status(404).json({ message: "Invalid invite code" });
		if (!block.inviteCodeExpiresAt || block.inviteCodeExpiresAt < new Date())
			return res.status(400).json({ message: "Invite code expired" });

		const user = await User.findById(req.user.id);

		if (user.block)
			return res.status(400).json({ message: "Already joined a block" });

		const currentStudents = await User.countDocuments({
			block: block._id,
		});

		if (currentStudents >= block.maxCapacity)
			return res.status(400).json({ message: "Block is full" });

		user.block = block._id;
		await user.save();

		res.json({ message: "Joined block successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const leaveBlock = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		if (!user.block) {
			return res.status(400).json({ message: "Not assigned to any block" });
		}

		if (user.room) {
			return res.status(400).json({
				message: "Must leave room before leaving block. Contact administrator.",
			});
		}

		user.block = null;
		await user.save();

		res.json({ message: "Left block successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const removeStudentFromBlock = async (req, res) => {
	try {
		const { studentId } = req.body;

		// Find the student
		const student = await User.findById(studentId);
		if (!student) {
			return res.status(404).json({ message: "Student not found" });
		}

		// Check if user is a student
		if (student.role !== "STUDENT") {
			return res.status(400).json({ message: "User is not a student" });
		}

		// Check if student is in a block
		if (!student.block) {
			return res.status(400).json({ message: "Student is not in any block" });
		}

		// Check if student is still assigned to a room
		if (student.room) {
			return res.status(400).json({
				message:
					"Student must be unassigned from room first before removing from block",
			});
		}

		// Get the block name before removing for response
		const block = await Block.findById(student.block);
		const blockName = block ? block.name : "Unknown";

		// Remove student from block
		student.block = null;
		await student.save();

		res.json({
			message: "Student removed from block successfully",
			student: {
				id: student._id,
				name: student.name,
				blockName,
			},
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
