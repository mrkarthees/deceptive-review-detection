import React from 'react';
import { Link } from 'react-router-dom';
import './collection.css';

const CollectionItem = React.memo(function CollectionItem({
	id,
	name,
	image,
	price,
	category,
	stock,
	offer,
}) {
	const stockValue = (stock || '').toLowerCase();

	const stockStatus =
		stockValue === 'instock' ? 'in' : stockValue === 'outofstock' ? 'out' : 'low';

	const stockLabel =
		stockValue === 'instock'
			? 'In Stock'
			: stockValue === 'outofstock'
				? 'Out of Stock'
				: 'Low Stock';

	return (
		<Link to={`/${id}`} className='collection-row'>
			<div className='col-image'>
				<img src={image} alt={name} />
			</div>

			<div className='col-name'>
				<p className='row-name'>{name}</p>
				{category && <span className='row-category'>{category}</span>}
			</div>

			<p className='row-price col-price'>₹ {price}</p>

			<span className={`stock-pill stock-${stockStatus} col-stock`}>
				{stockLabel}
			</span>

			<span className='offer-pill col-offer'>{offer}% off</span>
		</Link>
	);
});

export default CollectionItem;
