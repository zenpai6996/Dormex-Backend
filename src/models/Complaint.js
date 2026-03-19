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
	},
	{ timestamps: true },
);

export default mongoose.model("Complaint", complaintSchema);
