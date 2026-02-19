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
