import express from 'express';
import {
	addController,
	deleteController,
	listController,
	oneItemController,
	updateController,
} from '../Controller/productController.js';
import upload from '../Middleware/multer.js';
import adminAuth from '../Middleware/adminAuth.js';

const productRoute = express.Router();

productRoute.get('/list', listController);

productRoute.post(
	'/add',
	// adminAuth,
	upload.fields([{ name: 'imgOne', maxCount: 1 }]),
	addController,
);
productRoute.put(
	'/update/:id',
	adminAuth,
	upload.fields([{ name: 'imgOne', maxCount: 1 }]),
	updateController,
);
productRoute.delete('/delete/:id', adminAuth, deleteController);
productRoute.get('/oneitem', oneItemController);
export default productRoute;
