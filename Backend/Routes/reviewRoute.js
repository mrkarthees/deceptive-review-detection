import express from 'express';
import {
	addReview,
	adminReviewList,
	clientReviewList,
	updateReviewStatus,
	deleteReview,
	reviewAvailable,
} from '../Controller/reviewController.js';
const reviewRoute = express.Router();
reviewRoute.post('/review-available', reviewAvailable);
reviewRoute.get('/client-list/:id', clientReviewList);
reviewRoute.get('/adminlist', adminReviewList);
reviewRoute.post('/add/:id', addReview);
reviewRoute.put('/update/:id', updateReviewStatus);
reviewRoute.put('/delete/:id', deleteReview);

export default reviewRoute;
