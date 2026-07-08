import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../Context/Context';
import axios from 'axios';
import { backendURL } from '../../App';
import './dashboard.css';

const Dashboard = ({ token }) => {
	const { userInput } = useContext(DataContext);
	const [products, setProducts] = useState([]);

	useEffect(() => {
		const getProducts = async () => {
			try {
				const response = await axios.get(backendURL + '/product/list', {
					headers: { token },
				});
				setProducts(response.data.Products || []);
			} catch (error) {
				console.log(error.message);
			}
		};
		getProducts();
	}, []);

	const totalProducts = products.length;
	const avgOffer = products.length
		? Math.round(
				products.reduce((sum, p) => sum + (p.offer || 0), 0) / products.length,
			)
		: 0;

	// Group by category for the bar chart
	const categoryMap = {};
	products.forEach((p) => {
		const key = p.category || 'Other';
		categoryMap[key] = (categoryMap[key] || 0) + 1;
	});
	const categoryData = Object.entries(categoryMap);
	const maxCategoryCount = Math.max(1, ...categoryData.map(([, v]) => v));

	// Stock status comes as a string from backend: "Stock" | "No Stock"
	const inStock = products.filter((p) => p.stock === 'Stock').length;
	const outOfStock = products.filter((p) => p.stock === 'No Stock').length;

	return (
		<main className='dashboard'>
			<h1>Dashboard</h1>

			<div className='stat-cards'>
				<div className='stat-card'>
					<span className='stat-label'>Total Products</span>
					<span className='stat-value'>{totalProducts}</span>
				</div>
				<div className='stat-card'>
					<span className='stat-label'>In Stock</span>
					<span className='stat-value'>{inStock}</span>
				</div>
				<div className='stat-card'>
					<span className='stat-label'>Out of Stock</span>
					<span className='stat-value'>{outOfStock}</span>
				</div>
				<div className='stat-card'>
					<span className='stat-label'>Avg. Offer</span>
					<span className='stat-value'>{avgOffer}%</span>
				</div>
			</div>

			<div className='chart-grid'>
				<div className='chart-card chart-card-full'>
					<h2>Products by Category</h2>
					<div className='bar-chart'>
						{categoryData.length === 0 && <p className='chart-empty'>No data yet</p>}
						{categoryData.map(([label, count]) => (
							<div className='bar-row' key={label}>
								<span className='bar-label'>{label}</span>
								<div className='bar-track'>
									<div
										className='bar-fill'
										style={{ width: `${(count / maxCategoryCount) * 100}%` }}
									></div>
								</div>
								<span className='bar-count'>{count}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</main>
	);
};

export default Dashboard;
