import mongoose from "mongoose";

const leaveApplicationSchema = new mongoose.Schema(
	{
		student: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		block: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Block",
			required: true,
		},
		room: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Room",
			required: true,
		},
		fromDate: {
			type: Date,
			required: true,
		},
		toDate: {
			type: Date,
			required: true,
		},
		reason: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			enum: ["PENDING", "APPROVED", "REJECTED"],
			default: "PENDING",
		},
		approvedAt: {
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

leaveApplicationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("LeaveApplication", leaveApplicationSchema);
