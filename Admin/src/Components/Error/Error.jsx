import React, { useContext } from 'react';
import { DataContext } from '../../Context/Context.jsx';
import { NavLink } from 'react-router-dom';
import './error.css';
import { HiOutlineHome } from 'react-icons/hi2';

const Error = () => {
	const { slider, setSlider } = useContext(DataContext);
	return (
		<main className={`${slider == true ? 'container' : 'grid'}`}>
			<section className='error'>
				<div className='error-card'>
					<p className='error-code'>404</p>
					<h1>Page not found</h1>
					<p className='error-subtitle'>
						The page you're looking for doesn't exist or may have been moved.
					</p>
					<NavLink to='/' className='error-button'>
						<HiOutlineHome />
						<span>Back to Home</span>
					</NavLink>
				</div>
			</section>
		</main>
	);
};

export default Error;
