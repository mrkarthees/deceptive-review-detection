import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},

		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		userName: {
			type: String,
			required: true,
		},

		userEmail: {
			type: String,
			required: true,
		},

		review: {
			type: String,
			required: true,
		},

		status: {
			type: String,
			enum: ['approved', 'pending', 'warning', 'rejected'],
			default: 'pending',
		},

		active: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	},
);

export const Review = mongoose.model('Review', reviewSchema);
