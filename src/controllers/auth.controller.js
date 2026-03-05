import pkg from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const { compare, hash } = pkg;
const { sign } = jwt;

export async function register(req, res) {
	const { name, email, password } = req.body;
	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return res.status(400).json({ message: "Email already registered" });
	}

	const hashed = await hash(password, 10);

	await User.create({
		name,
		email,
		password: hashed,
		role: "STUDENT",
		status: "ACTIVE",
	});

	res.status(201).json({ message: "User registered" });
}

export async function login(req, res) {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user) return res.status(404).json({ message: "User not found" });

	const valid = await compare(password, user.password);
	if (!valid) return res.status(400).json({ message: "Invalid credentials" });

	const token = sign(
		{ id: user._id, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: "1d" },
	);

	res.json({ token, role: user.role });
}

export async function getProfile(req, res) {
	try {
		const user = await User.findById(req.user.id)
			.select("-password")
			.populate("block", "name")
			.populate("room", "roomNumber");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}

export async function changePassword(req, res) {
	try {
		const { currentPassword, newPassword } = req.body;
		const userId = req.user.id;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Verify current password
		const isValid = await compare(currentPassword, user.password);
		if (!isValid) {
			return res.status(401).json({ message: "Current password is incorrect" });
		}

		// Hash new password
		const hashedPassword = await hash(newPassword, 10);

		// Update password
		user.password = hashedPassword;
		await user.save();

		res.json({ message: "Password changed successfully" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
}
