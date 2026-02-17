import Room from "../models/Room.js";
import User from "../models/User.js";

export async function createRoom(req, res) {
	const room = await Room.create(req.body);
	res.status(201).json(room);
}

export async function getRooms(req, res) {
	const rooms = await Room.find().populate("occupants");
	res.json(rooms);
}

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
		if (!student || !student.room)
			return res
				.status(400)
				.json({ message: "Student not assigned to any room" });

		const room = await Room.findById(student.room);

		room.occupants = room.occupants.filter((id) => id.toString() !== studentId);

		await room.save();

		student.room = null;
		await student.save();

		res.json({ message: "Student removed from room" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
