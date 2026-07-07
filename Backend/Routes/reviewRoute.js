import express from 'express';
import {
	addReview,
	adminReviewList,
	clientReviewList,
	updateReviewStatus,
	deleteReview,
} from '../Controller/reviewController.js';
const reviewRoute = express.Router();
reviewRoute.get('/list', clientReviewList);
reviewRoute.get('/adminlist', adminReviewList);
reviewRoute.post('/add/:id', addReview);
reviewRoute.put('/update/:id', updateReviewStatus);
reviewRoute.put('/delete/:id', deleteReview);

export default reviewRoute;
