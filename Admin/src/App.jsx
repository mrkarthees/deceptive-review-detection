import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Dashboard/Dashboard';
import Review from './Pages/Review/Review';
import Collection from './Pages/Collection/Collection';
import UpdateProduct from './Pages/Update Product/UpdateProduct';
import Order from './Pages/Order/Order';
import Login from './Components/Login/Login';
import Error from './Components/Error/Error';
import AddProduct from './Pages/New Product/AddProduct';
import Navbar from './Components/Navbar/Navbar';
import Sidebar from './Components/Slidebar/Slidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
			<ToastContainer position='top-right' autoClose={2500} />
			{token === '' ? (
				<Login setToken={setToken} />
			) : (
				<section className='app-container'>
					<Sidebar token={token} setToken={setToken} />
					<div className='page-content'>
						<Navbar />
						<Routes>
							<Route index element={<Collection token={token} />} />
							<Route path='/dashboard' element={<Dashboard token={token} />} />
							<Route path='/:productId' element={<UpdateProduct token={token} />} />
							<Route path='/review' element={<Review />} />
							<Route path='/orders' element={<Order />} />
							<Route path='/login' element={<Login />} />
							<Route path='/add' element={<AddProduct token={token} />} />
							<Route path='*' element={<Error />} />
						</Routes>
					</div>
				</section>
			)}
		</>
	);
};

export default App;
