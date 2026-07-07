import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../Context/Context';
import axios from 'axios';
import { backendURL } from '../../App';
import CollectionItem from './CollectionItem';
import './collection.css';

const Collection = ({ token }) => {
	const { userInput } = useContext(DataContext);
	const [allProducts, setAllProducts] = useState([]);

	const getProduct = async () => {
		const response = await axios.get(backendURL + '/product/list', {
			headers: { token },
		});
		setAllProducts(response.data.Products);
	};

	useEffect(() => {
		getProduct();
	}, []);

	const filteredProducts = userInput
		? allProducts.filter((item) =>
				item.name.toLowerCase().includes(userInput.toLowerCase()),
			)
		: allProducts;

	return (
		<main className='collection'>
			<div className='collection-head'>
				<h1>All Products</h1>
				<span className='collection-count'>{filteredProducts.length} items</span>
			</div>

			<div className='collection-table'>
				<div className='collection-row collection-row-head'>
					<p>Image</p>
					<p className='col-name'>Name</p>
					<p className='col-price'>Price</p>
					<p className='col-stock'>Stock</p>
					<p className='col-offer'>Offer</p>
				</div>

				<div className='collection-body'>
					{filteredProducts.map((item, index) => (
						<CollectionItem
							key={index}
							id={item._id}
							name={item.name}
							image={item.image[0]}
							price={item.price}
							brand={item.brand}
							category={item.category}
							description={item.description}
							stock={item.stock}
							offer={item.offer}
						/>
					))}
					{filteredProducts.length === 0 && (
						<p className='empty-state'>No products found.</p>
					)}
				</div>
			</div>
		</main>
	);
};

export default Collection;
