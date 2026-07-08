import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DataContext } from '../../Context/Context';
import { backendURL } from '../../App';
import './order.css';

const Order = () => {
	const { slider } = useContext(DataContext);
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchOrders = async () => {
		try {
			const response = await axios.get(backendURL + '/order/all-orders');

			if (response.data.result) {
				setOrders(response.data.orders);
			} else {
				toast.error(response.data.mistake || 'Failed to load orders');
			}
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong while loading orders');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	return (
		<main className={slider ? 'container' : 'grid'}>
			<section className='order'>
				<div className='order-head'>
					<h1>Orders</h1>
					<span className='order-count'>{orders.length} orders</span>
				</div>

				<div className='order-table'>
					<div className='order-row order-row-head'>
						<p>Order ID</p>
						<p>Customer</p>
						<p>Address</p>
						<p>Phone</p>
					</div>

					<div className='order-body'>
						{loading ? (
							<div className='order-loading'>
								<span className='spinner large'></span>
								<p>Loading orders...</p>
							</div>
						) : orders.length === 0 ? (
							<p className='empty-state'>No orders found.</p>
						) : (
							orders.map((item) => (
								<div className='order-row' key={item._id}>
									<p className='col-id' title={item._id}>
										#{item._id.slice(-6).toUpperCase()}
									</p>

									<p className='row-name'>{item.name}</p>

									<p className='col-address' title={item.address}>
										{item.address}
									</p>

									<p className='col-phone'>{item.phoneNo}</p>
								</div>
							))
						)}
					</div>
				</div>
			</section>
		</main>
	);
};

export default Order;
