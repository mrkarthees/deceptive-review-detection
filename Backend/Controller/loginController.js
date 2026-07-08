import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Login } from '../models/loginModel.js';

// Register
export const registerController = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res.json({
				result: false,
				heed: 'Please enter all fields.',
			});
		}

		const existUser = await Login.findOne({ email });

		if (existUser) {
			// Permanently Blocked User
			if (!existUser.active && existUser.isDeceptive) {
				return res.json({
					result: false,
					heed: 'This email has been permanently blocked due to deceptive activity.',
				});
			}

			// Warning User (Allow Re-Registration)
			if (!existUser.active && !existUser.isDeceptive) {
				await Login.findByIdAndDelete(existUser._id);
			}

			// Already Registered
			if (existUser.active) {
				return res.json({
					result: false,
					heed: 'This email address is already registered.',
				});
			}
		}

		const hashPassword = await bcrypt.hash(password, 10);

		const newUser = new Login({
			name,
			email,
			password: hashPassword,
		});

		await newUser.save();

		return res.json({
			result: true,
			heed: 'Registration was successful.',
		});
	} catch (error) {
		return res.json({
			result: false,
			mistake: error.message,
		});
	}
};

// Login
export const loginController = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await Login.findOne({ email });

		// User Not Found
		if (!user) {
			return res.json({
				result: false,
				heed: 'Please register',
			});
		}

		// Permanently Blocked
		if (!user.active && user.isDeceptive) {
			return res.json({
				result: false,
				heed: 'Your email has been permanently blocked due to deceptive reviews.',
			});
		}

		// Warning User
		if (!user.active && !user.isDeceptive) {
			return res.json({
				result: false,
				heed: 'Your account is inactive. Please register again.',
			});
		}

		// Password Check
		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.json({
				result: false,
				heed: 'Invalid email or password.',
			});
		}

		const token = jwt.sign(
			{
				id: user._id,
				name: user.name,
				email: user.email,
			},
			process.env.JWT_TOKEN,
			{
				expiresIn: '7d',
			},
		);

		res.cookie('token', token, {
			httpOnly: true,
			secure: false, // true in production with HTTPS
			sameSite: 'lax',
		});

		return res.json({
			result: true,
			heed: 'Welcome to STARS, happy shopping!',
			token,
		});
	} catch (error) {
		return res.json({
			result: false,
			mistake: error.message,
		});
	}
};

//Logout Controller
export const logoutController = async (req, res) => {
	res.clearCookie('token');
	res.json({
		heed: 'Cookie Was Cleared',
		result: true,
	});
};

//Admin Login
export const adminLoginController = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (
			email === process.env.ADMIN_EMAIL &&
			password === process.env.ADMIN_PASSWORD
		) {
			const token = jwt.sign({ email, password }, process.env.JWT_TOKEN);
			res.json({
				heed: 'Welcome Admin ',
				result: true,
				token,
			});
		} else {
			res.json({
				heed: 'Admin credentials wrong',
				result: false,
			});
		}
	} catch (error) {
		res.json({
			mistake: error.message,
			result: false,
		});
	}
};
