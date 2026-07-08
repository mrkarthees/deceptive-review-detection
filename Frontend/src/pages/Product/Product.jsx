import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdOutlineShoppingCartCheckout } from 'react-icons/md';
import { HiBadgeCheck } from 'react-icons/hi';
import { FaTrash } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import { backendURL } from '../../App';
import { DataContext } from '../../Context/Context';
import './product.css';

const Product = ({ token }) => {
	const { slider, currency, setShowReview, setProductId } =
		useContext(DataContext);

	const navigate = useNavigate();
	const { productId } = useParams();

	const [name, setName] = useState('');
	const [price, setPrice] = useState('');
	const [description, setDescription] = useState('');
	const [offer, setOffer] = useState('');
	const [imgOne, setImgOne] = useState('');
	const [allReview, setAllReview] = useState([]);
	const [review, setReview] = useState('');
	const [canReview, setCanReview] = useState(false);

	const eachProduct = async () => {
		try {
			const response = await axios.get(backendURL + '/product/list', {
				headers: {
					token,
				},
			});

			const found = response.data.Products.find((item) => item._id === productId);

			if (found) {
				setName(found.name);
				setImgOne(found.image[0]);
				setPrice(found.price);
				setOffer(found.offer);
				setDescription(found.description);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const eachReview = async () => {
		try {
			const jwtToken = localStorage.getItem('token');

			let userId = '';

			if (jwtToken) {
				const decoded = jwtDecode(jwtToken);
				userId = decoded.id;
			}

			const response = await axios.get(
				backendURL + `/review/client-list/${userId}`,
			);

			setAllReview(response.data.reviews);
		} catch (err) {
			console.log(err);
		}
	};

	const deleteReview = async (reviewId) => {
		try {
			const response = await axios.put(backendURL + `/review/delete/${reviewId}`);

			if (response.data.result) {
				eachReview();
				checkReviewAvailable();
			}
		} catch (err) {
			console.log(err);
		}
	};

	const checkReviewAvailable = async () => {
		try {
			const jwtToken = localStorage.getItem('token');

			if (!jwtToken) {
				setCanReview(false);
				return;
			}

			const decoded = jwtDecode(jwtToken);

			const userId = decoded.id;

			const response = await axios.post(backendURL + '/review/review-available', {
				userId,
				productId,
			});

			setCanReview(response.data.isReview);
		} catch (err) {
			console.log(err);
			setCanReview(false);
		}
	};

	useEffect(() => {
		eachProduct();
		eachReview();
		checkReviewAvailable();
	}, [productId]);

	const productReviews = allReview.filter(
		(item) =>
			item.productId === productId && item.status === 'approved' && item.active,
	);

	const buyHandler = () => {
		setProductId(productId);
		navigate('/order');
	};

	const reviewHandler = async () => {
		try {
			const jwtToken = localStorage.getItem('token');

			if (!jwtToken) {
				alert('Please login first');
				return;
			}

			const decoded = jwtDecode(jwtToken);

			const userId = decoded.id;

			await axios.post(backendURL + `/review/add/${productId}`, {
				userId,
				review,
			});

			setShowReview(false);
			setReview('');
			eachReview();
			checkReviewAvailable();
		} catch (err) {
			console.log(err);
		}
	};

	const formatDate = (date) => {
		return new Date(date).toLocaleString('en-IN', {
			timeZone: 'Asia/Kolkata',
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		});
	};

	return (
		<main className={slider ? 'container' : 'grid'}>
			<section className='product'>
				<div className='product-details'>
					<div className='left'>
						<img src={imgOne} alt={name} />
					</div>

					<div className='right'>
						<div className='name-price'>
							<h1>{name}</h1>

							<h1>
								{currency} {price}
							</h1>
						</div>

						<div className='product-description'>
							<p>{description}</p>
						</div>

						<div className='offer-buy'>
							<h2>{offer}% off</h2>

							<button onClick={buyHandler}>
								Buy
								<MdOutlineShoppingCartCheckout />
							</button>
						</div>
					</div>
				</div>
				{productReviews.length > 0 && (
					<div className='review-container'>
						<h1>Customer Reviews</h1>

						{productReviews.map((item) => (
							<div className='reviews' key={item._id}>
								<div className='review-top'>
									<div className='review-user'>
										<strong>{item.userName}</strong>

										{item.status === 'approved' && (
											<HiBadgeCheck
												className='verified-icon'
												title='Verified Review'
												color='#16a34a'
												size={18}
											/>
										)}
									</div>

									<div className='review-actions'>
										<small>{formatDate(item.createdAt)}</small>

										{item.isDelete && (
											<FaTrash
												className='delete-review'
												onClick={() => deleteReview(item._id)}
											/>
										)}
									</div>
								</div>

								<p>{item.review}</p>
							</div>
						))}
					</div>
				)}

				{canReview && (
					<div className='review'>
						<h4>Please leave a review</h4>

						<input
							type='text'
							value={review}
							onChange={(e) => setReview(e.target.value)}
							placeholder='Enter your review'
						/>

						<button onClick={reviewHandler} disabled={!review.trim()}>
							Submit
						</button>
					</div>
				)}

				{/* Optional message when user cannot review */}
				{!canReview && (
					<div
						className='review'
						style={{
							textAlign: 'center',
							padding: '20px',
						}}
					>
						<h4>You can review this product only after purchasing it.</h4>
					</div>
				)}
			</section>
		</main>
	);
};

export default Product;
