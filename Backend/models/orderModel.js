import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
	userId: {
		type: String,
	},
	productId: {
		type: String,
	},

	name: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	phoneNo: {
		type: Number,
		required: true,
	},
});

export const Order = mongoose.model('Order', orderSchema);
