import React, { useContext, useState } from 'react';
import { DataContext } from '../../Context/Context';
import axios from 'axios';
import './register.css';
import { NavLink } from 'react-router-dom';

const Register = () => {
	const { slider, setSlider } = useContext(DataContext);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const newUser = async () => {
		try {
			const user = await axios.post('http://localhost:4000/user/register', {
				name,
				email,
				password,
			});
		} catch (error) {
			console.error(error);
		}
		setName('');
		setEmail('');
		setPassword('');
	};
	return (
		<main className={`${slider == true ? 'container' : 'grid'}`}>
			<section className='register'>
				<div className='register-container'>
					<div className='register-card'>
						<h1>Create Account</h1>
						<p className='subtitle'>Sign up to get started.</p>
						<div className='data-box'>
							<input
								type='text'
								placeholder='Name'
								onChange={(e) => setName(e.target.value)}
								value={name}
								required
							/>
							<input
								type='email'
								placeholder='Email'
								onChange={(e) => setEmail(e.target.value)}
								value={email}
								required
							/>
							<input
								type='password'
								placeholder='Password'
								onChange={(e) => setPassword(e.target.value)}
								value={password}
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
