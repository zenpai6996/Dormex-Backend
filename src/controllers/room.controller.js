import Room from "../models/Room.js";

export async function createRoom(req, res) {
	const room = await Room.create(req.body);
	res.status(201).json(room);
}

export async function getRooms(req, res) {
	const rooms = await Room.find().populate("occupants");
	res.json(rooms);
}
