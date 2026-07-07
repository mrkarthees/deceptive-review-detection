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

	// Stock status comes as a string from backend: "instock" | "lowstock" | "outofstock"
	const inStock = products.filter((p) => p.stock === 'instock').length;
	const lowStock = products.filter((p) => p.stock === 'lowstock').length;
	const outOfStock = products.filter((p) => p.stock === 'outofstock').length;

	const donutData = [
		{ label: 'In stock', value: inStock, color: '#1e8e3e' },
		{ label: 'Low stock', value: lowStock, color: '#b26a00' },
		{ label: 'Out of stock', value: outOfStock, color: '#d50000' },
	];
	const donutTotal = Math.max(
		1,
		donutData.reduce((s, d) => s + d.value, 0),
	);

	let cumulative = 0;
	const donutSegments = donutData.map((d) => {
		const start = (cumulative / donutTotal) * 100;
		cumulative += d.value;
		const end = (cumulative / donutTotal) * 100;
		return { ...d, start, end };
	});

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
				<div className='chart-card'>
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

				<div className='chart-card'>
					<h2>Stock Status</h2>
					<div className='donut-wrap'>
						<svg viewBox='0 0 42 42' className='donut-chart'>
							<circle
								className='donut-ring'
								cx='21'
								cy='21'
								r='15.9'
								fill='transparent'
							></circle>
							{donutSegments.map((seg) => (
								<circle
									key={seg.label}
									cx='21'
									cy='21'
									r='15.9'
									fill='transparent'
									stroke={seg.color}
									strokeWidth='5'
									strokeDasharray={`${seg.end - seg.start} ${
										100 - (seg.end - seg.start)
									}`}
									strokeDashoffset={25 - seg.start}
									transform='rotate(-90 21 21)'
								></circle>
							))}
						</svg>
						<div className='donut-legend'>
							{donutData.map((d) => (
								<div className='legend-item' key={d.label}>
									<span
										className='legend-dot'
										style={{ backgroundColor: d.color }}
									></span>
									<span>{d.label}</span>
									<span className='legend-value'>{d.value}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Dashboard;
