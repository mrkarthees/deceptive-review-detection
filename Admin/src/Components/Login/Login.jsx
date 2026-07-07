import React, { useContext, useState } from 'react';
import { DataContext } from '../../Context/Context';
import axios from 'axios';
import './login.css';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import { backendURL } from '../../App';

const Login = ({ setToken }) => {
	const { slider, setSlider } = useContext(DataContext);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const getUser = async () => {
		try {
			const user = await axios.post(backendURL + '/user/admin', {
				email,
				password,
			});
			if (user.data.result) {
				setToken(user.data.token);
				navigate('/');
			} else {
				console.log('You are not Admin');
				navigate('/login');
			}
		} catch (error) {
			console.error(error);
		}
		setEmail('');
		setPassword('');
	};

	return (
		<main className={`${slider == true ? 'container' : 'grid'}`}>
			<section className='login'>
				<div className='login-container'>
					<div className='login-card'>
						<h1>Admin Login</h1>
						<p className='subtitle'>
							Sign in with your admin credentials to continue.
						</p>
						<div className='data-box'>
							<input
								type='text'
								placeholder='Email'
								onChange={(e) => setEmail(e.target.value)}
								value={email}
							/>
							<input
								type='password'
								placeholder='Password'
								onChange={(e) => setPassword(e.target.value)}
								value={password}
							/>
							<button onClick={getUser}>Sign In</button>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default Login;
