import React, { useContext, useState } from 'react';
import { DataContext } from '../../Context/Context';
import axios from 'axios';
import './login.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { backendURL } from '../../App';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ setToken }) => {
	const { slider } = useContext(DataContext);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const getUser = async () => {
		if (!email || !password) {
			toast.warn('Please enter both email and password');
			return;
		}

		try {
			const { data } = await axios.post(backendURL + '/user/login', {
				email,
				password,
			});

			if (data.result) {
				setToken(data.token);
				toast.success(data.message || 'Login successful');
				navigate('/');
			} else {
				toast.error(data.message || 'Invalid credentials, please register');
			}
		} catch (error) {
			toast.error(
				error.response?.data?.message || 'Something went wrong. Please try again.',
			);
		} finally {
			setEmail('');
			setPassword('');
		}
	};

	return (
		<main className={`${slider === true ? 'container' : 'grid'}`}>
			<section className='login'>
				<div className='login-container'>
					<div className='login-card'>
						<h1>Sign In</h1>
						<p className='subtitle'>Welcome back. Enter your details to continue.</p>
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
						<div className='details'>
							<p>Don't have an account?</p>
							<NavLink to='/register'>
								<p>Create one</p>
							</NavLink>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default Login;
