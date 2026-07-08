import { Review } from '../models/reviewModel.js';
import { Login } from '../models/loginModel.js';
import { moderateReview } from '../Middleware/geminiMiddleware.js';
import sendEmail from '../utils/sendEmail.js'; // Your email utility
import { Order } from '../models/orderModel.js';

// Review available
export const reviewAvailable = async (req, res) => {
	try {
		const { userId, productId } = req.body;

		if (!userId || !productId) {
			return res.json({
				result: false,
				isReview: false,
				heed: 'User ID and Product ID are required.',
			});
		}

		// Total purchases of this product by the user
		const orderCount = await Order.countDocuments({
			userId,
			productId,
		});

		if (orderCount === 0) {
			return res.json({
				result: true,
				isReview: false,
				heed: 'You must purchase this product before leaving a review.',
			});
		}

		// Total reviews written by the user for this product
		const reviewCount = await Review.countDocuments({
			userId,
			productId,
		});

		if (reviewCount >= orderCount) {
			return res.json({
				result: true,
				isReview: false,
				heed: 'You have already reviewed all of your purchases of this product.',
			});
		}

		return res.json({
			result: true,
			isReview: true,
			heed: 'Please leave your review for this product.',
		});
	} catch (error) {
		return res.json({
			result: false,
			isReview: false,
			mistake: error.message,
		});
	}
};

// Add Review
export const addReview = async (req, res) => {
	try {
		const productId = req.params.id;
		const { userId, review } = req.body;

		const user = await Login.findById(userId);

		if (!user) {
			return res.json({
				result: false,
				heed: 'User not found.',
			});
		}

		// Gemini Check
		const moderation = await moderateReview(review);

		let status = 'approved';

		if (!moderation.safe) {
			status = 'pending';
		}

		const newReview = new Review({
			userId: user._id,
			userName: user.name,
			userEmail: user.email,
			productId,
			review,
			status,
		});

		await newReview.save();

		res.json({
			result: true,
			status,
			reason: moderation.reason,
			heed: 'Review submitted.',
		});
	} catch (err) {
		res.json({
			result: false,
			mistake: err.message,
		});
	}
};

export const updateReviewStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		if (!['approved', 'warning', 'rejected'].includes(status)) {
			return res.json({
				result: false,
				heed: 'Invalid review status.',
			});
		}

		const review = await Review.findById(id);

		if (!review) {
			return res.json({
				result: false,
				heed: 'Review not found.',
			});
		}

		const user = await Login.findById(review.userId);

		if (!user) {
			return res.json({
				result: false,
				heed: 'User not found.',
			});
		}

		// ===========================
		// APPROVED
		// ===========================
		if (status === 'approved') {
			review.status = 'approved';
			review.active = true;

			user.active = true;
			user.isDeceptive = false;

			await user.save();
		}

		// ===========================
		// WARNING
		// ===========================
		if (status === 'warning') {
			review.status = 'warning';
			review.active = false;

			await sendEmail({
				to: user.email,
				subject: 'Review Warning',
				html: `
                    <h2>Review Warning</h2>

                    <p>Your review has violated our community guidelines.</p>

                    <p>This is an official warning.</p>

                    <p>If you continue posting inappropriate reviews, your account may be permanently blocked.</p>

                    <br>

                    <p>Thank you.</p>
                `,
			});
		}

		// ===========================
		// REJECTED
		// ===========================
		if (status === 'rejected') {
			review.status = 'rejected';
			review.active = false;

			user.active = false;
			user.isDeceptive = true;

			await user.save();

			await sendEmail({
				to: user.email,
				subject: 'Account Blocked',
				html: `
                    <h2>Account Blocked</h2>

                    <p>Your review has been identified as deceptive or abusive.</p>

                    <p>Your account has been permanently blocked.</p>

                    <p>This email address can no longer be used to register on our platform.</p>

                    <br>

                    <p>Thank you.</p>
                `,
			});
		}

		await review.save();

		return res.json({
			result: true,
			heed: `Review ${status} updated successfully.`,
			review,
		});
	} catch (error) {
		return res.json({
			result: false,
			mistake: error.message,
		});
	}
};

export const deleteReview = async (req, res) => {
	try {
		const { id } = req.params;

		const review = await Review.findById(id);

		if (!review) {
			return res.json({
				result: false,
				heed: 'Review not found.',
			});
		}

		review.active = false;

		await review.save();

		return res.json({
			result: true,
			heed: 'Review deleted successfully.',
		});
	} catch (error) {
		return res.json({
			result: false,
			mistake: error.message,
		});
	}
};

// Client Review List
export const clientReviewList = async (req, res) => {
	try {
		const { id: userId } = req.params;

		const reviews = await Review.find({
			active: true,
			status: 'approved',
		}).sort({ createdAt: -1 });

		const reviewList = reviews.map((review) => ({
			...review.toObject(),
			isDelete: review.userId.toString() === userId,
		}));

		return res.json({
			result: true,
			heed: 'Reviews fetched successfully.',
			reviews: reviewList,
		});
	} catch (error) {
		return res.json({
			result: false,
			mistake: error.message,
		});
	}
};

// Admin Review List
export const adminReviewList = async (req, res) => {
	try {
		const reviews = await Review.find({})
			.populate('productId', 'name')
			.sort({ createdAt: -1 });

		const formattedReviews = reviews.map((review) => ({
			_id: review._id,
			userId: review.userId,

			productId: review.productId?._id || null,
			productName: review.productId?.name || 'Product Not Found',

			userName: review.userName,
			userEmail: review.userEmail,

			review: review.review,

			status: review.status,
			active: review.active,

			createdAt: review.createdAt,
			updatedAt: review.updatedAt,
		}));

		return res.json({
			result: true,
			heed: 'All reviews fetched successfully.',
			reviews: formattedReviews,
		});
	} catch (error) {
		return res.json({
			result: false,
			mistake: error.message,
		});
	}
};
