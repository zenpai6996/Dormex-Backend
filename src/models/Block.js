import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		inviteCode: {
			type: String,
			unique: true,
		},
		maxCapacity: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true },
);
blockSchema.pre("deleteOne", { document: true }, async function () {
	await Room.deleteMany({ block: this._id });
	await User.updateMany({ block: this._id }, { block: null });
});

export default mongoose.model("Block", blockSchema);
