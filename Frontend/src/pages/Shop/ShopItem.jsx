import React from 'react';
import { Link } from 'react-router-dom';
import './shop.css';

const ShopItem = React.memo(function ShopItem({
	id,
	name,
	image,
	price,
	offer,
}) {
	return (
		<Link to={`/shop/${id}`}>
			<div className='item'>
				<img src={image} alt={name} />
				<div className='item-title'>
					<p className='name'>{name}</p>
					<div className='price-offer'>
						<p className='offer'>{offer}%</p>
						<p className='price'>₹ {price}</p>
					</div>
				</div>
			</div>
		</Link>
	);
});

export default ShopItem;
