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
