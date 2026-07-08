import express from 'express';
import {
	newOrderController,
	getAllOrdersController,
} from '../Controller/orderController.js';

const orderRoute = express.Router();
orderRoute.post('/new-order', newOrderController);
orderRoute.get('/all-orders', getAllOrdersController);
export default orderRoute;
