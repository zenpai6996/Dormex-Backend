import crypto from "crypto";
import Block from "../models/Block.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

function generateInviteCode() {
	return crypto.randomBytes(4).toString("hex"); // 8 char code
}

export const createBlock = async (req, res) => {
	try {
		const { name, maxCapacity } = req.body;

		const inviteCode = generateInviteCode();

		const block = await Block.create({
			name,
			maxCapacity,
			inviteCode,
			inviteCodeExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
		});

		res.status(201).json(block);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const getBlocks = async (req, res) => {
	const blocks = await Block.find();
	res.json(blocks);
};

export const getBlockById = async (req, res) => {
	try {
		const block = await Block.findById(req.params.id);
		if (!block) return res.status(404).json({ message: "Block not found" });

		// Get all rooms in this block with occupants
		const rooms = await Room.find({ block: block._id })
			.populate("occupants", "-password")
			.sort({ roomNumber: 1 });

		// Get all students in this block who haven't been assigned to rooms
		const unassignedStudents = await User.find({
			block: block._id,
			role: "STUDENT",
			room: null,
		}).select("-password");

		// Get assigned students count
		const assignedCount = await User.countDocuments({
			block: block._id,
			role: "STUDENT",
			room: { $ne: null },
		});

		res.json({
			block,
			rooms,
			unassignedStudents,
			stats: {
				totalStudents: unassignedStudents.length + assignedCount,
				assignedStudents: assignedCount,
				unassignedStudents: unassignedStudents.length,
				totalRooms: rooms.length,
				occupiedRooms: rooms.filter((r) => r.occupants.length > 0).length,
				totalCapacity: rooms.reduce((sum, r) => sum + (r.capacity || 0), 0),
				occupiedSeats: rooms.reduce((sum, r) => sum + r.occupants.length, 0),
			},
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const updateBlock = async (req, res) => {
	const block = await Block.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	res.json(block);
};

export const deleteBlock = async (req, res) => {
	await Block.findByIdAndDelete(req.params.id);
	res.json({ message: "Block deleted" });
};

export const regenerateInviteCode = async (req, res) => {
	try {
		let newCode;
		let existing;

		do {
			newCode = generateInviteCode();
			existing = await Block.findOne({ inviteCode: newCode });
		} while (existing);

		const block = await Block.findByIdAndUpdate(
			req.params.id,
			{
				inviteCode: newCode,
				inviteCodeExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			},
			{ new: true },
		);

		res.json(block);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
