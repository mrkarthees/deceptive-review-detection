import mongoose from 'mongoose';

export const connectDB = async (req, res) => {
	const MONGODB_URL = process.env.MONGODB_URL;
	await mongoose
		.connect(MONGODB_URL)
		.then(() => {
			console.log('DB Connected');
		})
		.catch((err) => {
			console.log('Network Problem');
			console.error(err);
		});
};
