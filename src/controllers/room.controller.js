import Room from "../models/Room.js";
import User from "../models/User.js";

export async function createRoom(req, res) {
	try {
		const { blockId, roomNumber, capacity } = req.body;

		const room = await Room.create({
			block: blockId,
			roomNumber,
			capacity,
		});

		res.status(201).json(room);
	} catch (err) {
		if (err.code === 11000) {
			return res.status(400).json({
				message: "Room already exists in this block",
			});
		}

		res.status(500).json({ message: err.message });
	}
}

export async function getRooms(req, res) {
	Room.find().populate("occupants", "-password").populate("block");
	res.json(rooms);
}

export const getRoomsByBlock = async (req, res) => {
	try {
		const { blockId } = req.params;
		const rooms = await Room.find({ block: blockId })
			.populate("occupants", "-password")
			.sort({ roomNumber: 1 });
		res.json(rooms);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const assignStudentToRoom = async (req, res) => {
	try {
		const { roomId, studentId } = req.body;

		const room = await Room.findById(roomId);
		if (!room) return res.status(404).json({ message: "Room not found" });

		const student = await User.findById(studentId);
		if (!student) return res.status(404).json({ message: "Student not found" });

		// Check role
		if (student.role !== "STUDENT")
			return res.status(400).json({ message: "User is not a student" });

		// Block validation
		if (!student.block)
			return res.status(400).json({ message: "Student not in any block" });

		if (student.block.toString() !== room.block.toString())
			return res.status(400).json({
				message: "Student and room belong to different blocks",
			});
		// Check if already assigned
		if (student.room)
			return res
				.status(400)
				.json({ message: "Student already assigned to a room" });

		// Capacity check
		if (room.occupants.length >= room.capacity)
			return res.status(400).json({ message: "Room is full" });

		// Assign
		room.occupants.push(student._id);
		await room.save();

		student.room = room._id;
		await student.save();

		res.json({ message: "Student assigned successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const removeStudentFromRoom = async (req, res) => {
	try {
		const { studentId } = req.body;

		const student = await User.findById(studentId);
		if (!student || !student.room) {
			return res
				.status(400)
				.json({ message: "Student not assigned to any room" });
		}

		const room = await Room.findById(student.room);
		if (!room) {
			return res.status(404).json({ message: "Room not found" });
		}

		// Remove student from room occupants
		room.occupants = room.occupants.filter((id) => id.toString() !== studentId);
		await room.save();

		// Remove room reference from student
		student.room = null;
		await student.save();

		res.json({ message: "Student removed from room" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const deleteRoom = async (req, res) => {
	try {
		const { roomId } = req.params;

		const room = await Room.findById(roomId);
		if (!room) {
			return res.status(404).json({ message: "Room not found" });
		}

		if (room.occupants.length > 0) {
			return res.status(400).json({
				message: "Cannot delete room with occupants. Remove students first.",
			});
		}

		await Room.findByIdAndDelete(roomId);
		res.json({ message: "Room deleted successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
