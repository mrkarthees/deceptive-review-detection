import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DataContext } from '../../Context/Context';
import { backendURL } from '../../App';
import './review.css';

const STATUS_OPTIONS = [
	{ value: 'approved', label: 'Approved' },
	{ value: 'warning', label: 'Warning' },
	{ value: 'rejected', label: 'Rejected' },
];

const StatusDropdown = ({ value, onChange, loading }) => {
	const [open, setOpen] = useState(false);
	const [openUp, setOpenUp] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleToggle = () => {
		if (!open && ref.current) {
			const rect = ref.current.getBoundingClientRect();
			const spaceBelow = window.innerHeight - rect.bottom;
			setOpenUp(spaceBelow < 260); // menu height ~ 3 items + padding
		}
		setOpen((prev) => !prev);
	};

	const current = STATUS_OPTIONS.find((opt) => opt.value === value);

	return (
		<div className={`status-dropdown ${openUp ? 'open-up' : ''}`} ref={ref}>
			<button
				type='button'
				disabled={loading}
				className={`status-dropdown-trigger status ${value} ${loading ? 'loading' : ''}`}
				onClick={handleToggle}
			>
				{loading ? (
					<span className='spinner'></span>
				) : (
					<>
						{current?.label}
						<span className={`chevron ${open ? 'open' : ''}`}>›</span>
					</>
				)}
			</button>

			<div className={`status-dropdown-menu ${open ? 'open' : ''}`}>
				{STATUS_OPTIONS.map((opt) => (
					<div
						key={opt.value}
						className={`status-dropdown-item ${opt.value === value ? 'selected' : ''}`}
						onClick={() => {
							onChange(opt.value);
							setOpen(false);
						}}
					>
						<span className={`dot ${opt.value}`}></span>
						{opt.label}
						{opt.value === value && <span className='check'>✓</span>}
					</div>
				))}
			</div>
		</div>
	);
};

const Review = () => {
	const { slider } = useContext(DataContext);
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [updatingId, setUpdatingId] = useState(null);

	const fetchReviews = async () => {
		try {
			const response = await axios.get(backendURL + '/review/adminlist');
			if (response.data.result) {
				setReviews(response.data.reviews);
			}
		} catch (error) {
			console.log(error);
			toast.error('Failed to load reviews');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchReviews();
	}, []);

	const updateStatus = async (id, status) => {
		setUpdatingId(id);
		try {
			const response = await axios.put(backendURL + `/review/update/${id}`, {
				status,
			});

			if (response.data.result) {
				toast.success(response.data.heed || 'Status updated successfully');
				setReviews((prev) =>
					prev.map((item) => (item._id === id ? { ...item, status } : item)),
				);
			} else {
				toast.error(response.data.heed || 'Failed to update status');
			}
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong while updating status');
		} finally {
			setUpdatingId(null);
		}
	};

	return (
		<main className={slider ? 'container' : 'grid'}>
			<section className='review'>
				<div className='review-head'>
					<h1>Review Management</h1>
					<span className='review-count'>{reviews.length} reviews</span>
				</div>

				<div className='review-table'>
					<div className='review-row review-row-head'>
						<p>Product</p>
						<p>User</p>
						<p>Review</p>
						<p>Status</p>
						<p>Active</p>
						<p>Date</p>
					</div>

					<div className='review-body'>
						{loading ? (
							<div className='review-loading'>
								<span className='spinner large'></span>
								<p>Loading reviews...</p>
							</div>
						) : reviews.length === 0 ? (
							<p className='empty-state'>No reviews found.</p>
						) : (
							reviews.map((item) => (
								<div className='review-row' key={item._id}>
									<div className='col-product'>
										<p className='row-name'>{item.productName}</p>
									</div>

									<div className='col-user'>
										<p className='row-name'>{item.userName}</p>
										<p className='row-email'>{item.userEmail}</p>
									</div>

									<p className='col-review' title={item.review}>
										{item.review}
									</p>

									<div className='col-status'>
										<StatusDropdown
											value={item.status}
											loading={updatingId === item._id}
											onChange={(status) => updateStatus(item._id, status)}
										/>
									</div>

									<div className='col-active'>
										<label className={item.active ? 'active' : 'inactive'}>
											{item.active ? 'Yes' : 'No'}
										</label>
									</div>

									<p className='col-date'>{new Date(item.createdAt).toLocaleString()}</p>
								</div>
							))
						)}
					</div>
				</div>
			</section>
		</main>
	);
};

export default Review;
