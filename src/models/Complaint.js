import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
	{
		student: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		block: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Block",
		},
		room: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Room",
		},
		category: String,
		description: String,
		status: {
			type: String,
			enum: ["OPEN", "IN_PROGRESS", "RESOLVED"],
			default: "OPEN",
		},
		resolvedAt: {
			type: Date,
			default: null,
		},
		expiresAt: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true },
);

complaintSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Complaint", complaintSchema);
