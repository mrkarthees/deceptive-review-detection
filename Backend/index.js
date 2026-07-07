import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { connectDB } from './Mongo DB/database.js';
import loginRoute from './Routes/loginRoute.js';
import productRoute from './Routes/productRoute.js';
import 'dotenv/config';
import { cloudinaryConfig } from './config/Cloudinary.js';
import reviewRoute from './Routes/reviewRoute.js';
import orderRoute from './Routes/orderRoute.js';

const PORT = process.env.PORT || 3000;
const app = express();

await connectDB();
cloudinaryConfig();

app.use(express.json());

// CORS setup
const allowAll = process.env.ALLOW_ALL_ORIGINS === 'true';
const allowedOrigins = process.env.ALLOWED_ORIGINS
	? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
	: [];

app.use(
	cors({
		origin: allowAll ? true : allowedOrigins,
		credentials: true,
	}),
);

app.get('/', (req, res) => {
	res.send('Welcome Express Js');
});

app.use('/user', loginRoute);
app.use('/product', productRoute);
app.use('/review', reviewRoute);
app.use('/order', orderRoute);

// Only bind a port for local dev — Vercel runs this as a serverless function instead
if (!process.env.VERCEL) {
	app.listen(PORT, () => {
		console.log(`Server Name http://localhost:${PORT}`);
	});
}

export default app;
export const handler = serverless(app);
