import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./src/app.js";
dotenv.config();

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("MongoDB Connected");
		app.listen(process.env.PORT, () =>
			console.log(`Server running on port ${process.env.PORT}`),
		);
	})
	.catch((err) => console.log(err));
