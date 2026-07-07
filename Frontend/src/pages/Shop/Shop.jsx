import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../Context/Context';
import './shop.css';
import axios from 'axios';
import { backendURL } from '../../App';
import ShopItem from './ShopItem';

const Shop = ({ token }) => {
	const { slider, setSlider, currency, userInput } = useContext(DataContext);
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
		<main className={`${slider == true ? 'container' : 'grid'}`}>
			<section className='shop'>
				<div className='all-products'>
					{filteredProducts.map((item, index) => (
						<div key={index} className='product-item'>
							<ShopItem
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
						</div>
					))}
				</div>
			</section>
		</main>
	);
};

export default Shop;
