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

		rollNo: {
			type: String,
			unique: true,
			sparse: true, // Allows null/undefined for admins
			required: function () {
				return this.role === "STUDENT";
			},
		},
		dateOfBirth: {
			type: Date,
			required: function () {
				return this.role === "STUDENT";
			},
		},
		phoneNumber: {
			type: String,
			required: function () {
				return this.role === "STUDENT";
			},
		},
		branch: {
			type: String,
			enum: ["IT", "CS", "ECE", "EE", "ME", "CE", "OTHER"],
			required: function () {
				return this.role === "STUDENT";
			},
		},
		joiningDate: {
			type: Date,
			default: Date.now,
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
