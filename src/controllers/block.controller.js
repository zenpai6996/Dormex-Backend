import crypto from "crypto";
import Block from "../models/Block.js";

function generateInviteCode() {
	return crypto.randomBytes(4).toString("hex"); // 8 char code
}

export const createBlock = async (req, res) => {
	const { name } = req.body;

	const inviteCode = generateInviteCode();

	const block = await Block.create({
		name,
		inviteCode,
	});

	res.status(201).json(block);
};

export const getBlocks = async (req, res) => {
	const blocks = await Block.find();
	res.json(blocks);
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
		const newCode = generateInviteCode();

		const block = await Block.findByIdAndUpdate(
			req.params.id,
			{ inviteCode: newCode },
			{ new: true },
		);

		res.json(block);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
