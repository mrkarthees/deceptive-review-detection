import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
	const { token } = req.headers;

	try {
		if (!token) {
			return res.json({
				heed: 'empty token Please Login',
				result: false,
			});
		}
		const tokenDecode = jwt.verify(token, process.env.JWT_TOKEN);
		if (tokenDecode !== process.env.ADMIN_PASSWORD) {
			return res.json({
				heed: 'token wrong Please Login',
				result: false,
			});
		}
		next();
	} catch (error) {
		res.json({
			mistake: error.message,
			result: false,
		});
	}
};

export default adminAuth;
