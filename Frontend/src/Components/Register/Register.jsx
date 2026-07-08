import React, { useContext, useState } from 'react';
import { DataContext } from '../../Context/Context';
import axios from 'axios';
import './register.css';
import { NavLink, useNavigate } from 'react-router-dom';

const Register = () => {
	const { slider } = useContext(DataContext);
	const navigate = useNavigate();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const newUser = async () => {
		try {
			const { data } = await axios.post('http://localhost:4000/user/register', {
				name,
				email,
				password,
			});

			if (data.result) {
				alert(data.heed || 'Registration successful');

				setName('');
				setEmail('');
				setPassword('');

				navigate('/login');
			} else {
				alert(data.heed || 'Registration failed');
			}
		} catch (error) {
			console.error(error);
			alert('Something went wrong');
		}
	};

	return (
		<main className={slider ? 'container' : 'grid'}>
			<section className='register'>
				<div className='register-container'>
					<div className='register-card'>
						<h1>Create Account</h1>
						<p className='subtitle'>Sign up to get started.</p>

						<div className='data-box'>
							<input
								type='text'
								placeholder='Name'
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>

							<input
								type='email'
								placeholder='Email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>

							<input
								type='password'
								placeholder='Password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>

							<button onClick={newUser}>Create Account</button>
						</div>

						<div className='details'>
							<p>Already have an account?</p>
							<NavLink to='/login'>
								<p>Sign in</p>
							</NavLink>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default Register;
