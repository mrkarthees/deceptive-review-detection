import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar.jsx';
import Slidebar from './Components/Slidebar/Slidebar.jsx';
import Error from './Components/Error/Error.jsx';
import Home from './pages/Home/Home.jsx';
import Shop from './pages/Shop/Shop.jsx';
import ContactUs from './pages/Contact Us/ContactUs.jsx';
import Login from './Components/Login/Login.jsx';
import Register from './Components/Register/Register.jsx';
import ShopItem from './pages/Shop/ShopItem.jsx';
import Product from './pages/Product/Product.jsx';
import Thankyou from './Components/Thankyou/Thankyou.jsx';
import Order from './pages/Order/Order.jsx';
export const backendURL = import.meta.env.VITE_BACKEND_URL;

const App = () => {
	const [token, setToken] = useState(
		localStorage.getItem('token') ? localStorage.getItem('token') : '',
	);
	useEffect(() => {
		localStorage.setItem('token', token);
	}, [token]);
	return (
		<>
			{token === '' ? (
				<Routes>
					<Route index element={<Login setToken={setToken} />} />
					<Route path='/register' element={<Register />} />
					<Route path='/login' element={<Login setToken={setToken} />} />
				</Routes>
			) : (
				<div className='app-container'>
					<Slidebar token={token} setToken={setToken} />
					<div className='page-content'>
						<Navbar />
						<Routes>
							<Route index element={<Home token={token} />} />
							<Route path='/shop' element={<Shop token={token} />} />
							<Route path='/contact-us' element={<ContactUs token={token} />} />
							<Route path='/shop/:productId' element={<Product token={token} />} />
							<Route path='/login' element={<Login />} />
							<Route path='/register' element={<Register />} />
							<Route path='/thankyou' element={<Thankyou />} />
							<Route path='/order' element={<Order />} />
							<Route path='*' element={<Error />} />
						</Routes>
					</div>
				</div>
			)}
		</>
	);
};

export default App;
