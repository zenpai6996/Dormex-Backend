import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./src/app.js";
dotenv.config();
const PORT = process.env.PORT;

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("MongoDB Connected");
		app.listen(PORT, "0.0.0.0", () =>
			console.log(`Server running on port ${PORT}`),
		);
	})
	.catch((err) => console.log(err));

app.get("/", async (req, res) => {
	res.status(200).json({
		message: "Welcome to Dormex API",
	});
});
