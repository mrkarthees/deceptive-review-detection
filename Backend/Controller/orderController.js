import { Order } from '../models/orderModel.js';

export const newOrderController = async (req, res) => {
	try {
		const { name, address, phoneNo, productId, userId } = req.body;
		const newOrder = new Order({
			userId,
			productId,
			name,
			address,
			phoneNo,
		});
		await newOrder.save();
		res.json({
			heed: 'Order successfully added to the database.',
			result: true,
		});
	} catch (error) {
		res.json({
			mistake: error.message,
			result: false,
		});
	}
};

export const getAllOrdersController = async (req, res) => {
	try {
		const orders = await Order.find().sort({ _id: -1 });

		res.json({
			result: true,
			heed: 'Orders fetched successfully.',
			orders,
		});
	} catch (error) {
		res.json({
			result: false,
			mistake: error.message,
		});
	}
};
