import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, unique: true, required: true },
		password: { type: String, required: true },
		role: {
			type: String,
			enum: ["ADMIN", "STUDENT"],
			default: "STUDENT",
		},
		status: {
			type: String,
			enum: ["ACTIVE", "LEFT", "TRANSFERRED"],
			default: "ACTIVE",
		},
		block: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Block",
			default: null,
		},
		room: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Room",
			default: null,
		},
	},
	{ timestamps: true },
);

export default mongoose.model("User", userSchema);
