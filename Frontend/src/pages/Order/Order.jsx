import React, { useContext, useState } from 'react';
import './order.css';
import { DataContext } from '../../Context/Context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { backendURL } from '../../App.jsx';

const Order = () => {
	const { slider, productId, setShowReview } = useContext(DataContext);

	const [name, setName] = useState('');
	const [address, setAddress] = useState('');
	const [phoneNo, setPhoneNo] = useState('');

	const navigate = useNavigate();

	const submitHandler = async (e) => {
		e.preventDefault();

		if (!name || !address || !phoneNo) {
			alert('Enter All Fields');
			return;
		}

		try {
			const token = localStorage.getItem('token');

			if (!token) {
				alert('Please login first');
				return;
			}

			const decoded = jwtDecode(token);

			// Change to decoded.userId if your JWT stores userId instead of id
			const userId = decoded.id;

			const response = await axios.post(backendURL + '/order/new-order', {
				userId,
				productId,
				name,
				address,
				phoneNo,
			});

			if (response.data.result) {
				setShowReview(true);
				navigate('/thankyou');
			} else {
				alert(response.data.heed || 'Order failed');
			}
		} catch (error) {
			console.log(error);
			alert('Something went wrong.');
		}
	};

	return (
		<main className={slider ? 'container' : 'grid'}>
			<section className='order'>
				<div className='order-container'>
					<div className='order-card'>
						<h1>Enter Order Detail</h1>

						<p className='subtitle'>Fill in your details to complete the purchase.</p>

						<form className='data-box' onSubmit={submitHandler}>
							<input
								type='text'
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder='Enter Name'
							/>

							<textarea
								value={address}
								onChange={(e) => setAddress(e.target.value)}
								placeholder='Enter Address'
							/>

							<input
								type='number'
								value={phoneNo}
								onChange={(e) => setPhoneNo(e.target.value)}
								placeholder='Enter Phone No'
							/>

							<div className='btn'>
								<button type='submit'>Buy Now</button>

								<button type='button' onClick={() => navigate('/shop')}>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			</section>
		</main>
	);
};

export default Order;
