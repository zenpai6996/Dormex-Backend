import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
	{
		block: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Block",
			required: true,
		},
		roomNumber: {
			type: String,
			required: true,
		},
		capacity: Number,
		occupants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true },
);
roomSchema.index({ block: 1, roomNumber: 1 }, { unique: true });

export default mongoose.model("Room", roomSchema);
