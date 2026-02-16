import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
	{
		block: String,
		floor: Number,
		roomNumber: String,
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

export default mongoose.model("Room", roomSchema);
