import mongoose from "mongoose";

const messSchema = new mongoose.Schema(
	{
		day: String,
		breakfast: String,
		lunch: String,
		dinner: String,
	},
	{ timestamps: true },
);

export default mongoose.model("MessMenu", messSchema);
