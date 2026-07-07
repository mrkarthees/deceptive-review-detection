import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdOutlineShoppingCartCheckout } from 'react-icons/md';
import { HiBadgeCheck } from 'react-icons/hi';
import { backendURL } from '../../App';
import { DataContext } from '../../Context/Context';
import './product.css';

const Product = ({ token }) => {
	const {
		slider,
		setSlider,
		currency,
		showReview,
		setShowReview,
		setProductId,
	} = useContext(DataContext);
	const navigate = useNavigate();
	const { productId } = useParams();

	const [name, setName] = useState('');
	const [price, setPrice] = useState('');
	const [description, setDescription] = useState('');
	const [offer, setOffer] = useState('');
	const [imgOne, setImgOne] = useState('');
	const [allReview, setAllReview] = useState([]);
	const [review, setReview] = useState('');

	const eachProduct = async () => {
		const response = await axios.get(backendURL + '/product/list', {
			headers: { token },
		});
		const found = response.data.Products.find((item) => item._id === productId);
		if (found) {
			setName(found.name);
			setImgOne(found.image[0]);
			setPrice(found.price);
			setOffer(found.offer);
			setDescription(found.description);
		}
	};

	const eachReview = async () => {
		const response = await axios.get(backendURL + '/review/list');
		setAllReview(response.data.reviews);
	};

	useEffect(() => {
		eachProduct();
		eachReview();
	}, [productId]);

	const productReviews = allReview.filter(
		(item) => item.productId === productId,
	);

	const buyHandler = () => {
		setProductId(productId);
		navigate('/order');
	};

	const reviewHandler = async () => {
		await axios.post(backendURL + `/review/add/${productId}`, {
			name,
			review,
		});
		setShowReview(false);
		setReview('');
		eachReview();
	};

	return (
		<main className={`${slider == true ? 'container' : 'grid'}`}>
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
						<h1>Reviews</h1>
						{productReviews.map((item, index) => (
							<div className='reviews' key={index}>
								<h4>
									<span>{item.name}</span>
									<HiBadgeCheck className='verified-icon' title='Verified buyer' />
								</h4>
								<p>{item.review}</p>
							</div>
						))}
					</div>
				)}

				{showReview && (
					<div className='review'>
						<h4>Please leave a review</h4>
						<input
							type='text'
							value={review}
							onChange={(e) => setReview(e.target.value)}
							placeholder='Enter your review'
						/>
						<button onClick={reviewHandler}>Submit</button>
					</div>
				)}
			</section>
		</main>
	);
};

export default Product;
