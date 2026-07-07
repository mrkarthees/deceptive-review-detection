import React, { useContext } from 'react';
import './slidebar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { DataContext } from '../../Context/Context';
import axios from 'axios';
import { backendURL } from '../../App';
import Logo from '../../assets/images/logo_1.png';
import {
	HiOutlineHome,
	HiOutlineShoppingBag,
	HiOutlineChatBubbleLeftRight,
	HiMiniBars3CenterLeft,
	HiMiniXMark,
} from 'react-icons/hi2';
import { HiOutlineLogout } from 'react-icons/hi';

const navItems = [
	{ to: '/', label: 'Home', icon: <HiOutlineHome /> },
	{ to: 'shop', label: 'Shop', icon: <HiOutlineShoppingBag /> },
	{
		to: 'contact-us',
		label: 'Contact Us',
		icon: <HiOutlineChatBubbleLeftRight />,
	},
];

const Slidebar = ({ token, setToken }) => {
	const { slider, setSlider } = useContext(DataContext);
	const navigate = useNavigate();

	const logoutHandler = async () => {
		try {
			const response = await axios.post(backendURL + '/user/logout');
			if (response.data.result) {
				localStorage.clear();
				setToken('');
				navigate('/login');
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<>
			{/* Desktop rail — hover expands via CSS, no click needed */}
			<aside className='sidebar-wrap'>
				<div className='rail'>
					<NavLink to='/' className='rail-brand'>
						<span className='rail-brand-icon'>
							<img src={Logo} alt='logo' />
						</span>
						<span className='rail-brand-name'>Stars Shop</span>
					</NavLink>

					<ul className='rail-nav'>
						{navItems.map((item) => (
							<li key={item.label} className='rail-item'>
								<NavLink
									to={item.to}
									className={({ isActive }) => `rail-link ${isActive ? 'active' : ''}`}
								>
									<span className='rail-icon'>{item.icon}</span>
									<span className='rail-label'>{item.label}</span>
								</NavLink>
							</li>
						))}
					</ul>

					{token !== '' && (
						<div className='rail-bottom'>
							<button className='rail-link rail-logout' onClick={logoutHandler}>
								<span className='rail-icon'>
									<HiOutlineLogout />
								</span>
								<span className='rail-label'>Logout</span>
							</button>
						</div>
					)}
				</div>
			</aside>

			{/* Mobile / tablet hamburger trigger */}
			<button
				className='mobile-trigger'
				onClick={() => setSlider(true)}
				aria-label='Open menu'
			>
				<HiMiniBars3CenterLeft />
			</button>

			{/* Mobile / tablet full-screen menu */}
			<div className={`mobile-panel ${slider ? 'mobile-panel-open' : ''}`}>
				<div className='mobile-panel-header'>
					<div className='mobile-brand'>
						<span className='mobile-brand-icon'>
							<img src={Logo} alt='logo' />
						</span>
						<span>Stars Shop</span>
					</div>
					<button
						className='mobile-close'
						onClick={() => setSlider(false)}
						aria-label='Close menu'
					>
						<HiMiniXMark />
					</button>
				</div>

				<ul className='mobile-nav'>
					{navItems.map((item) => (
						<li key={item.label}>
							<NavLink
								to={item.to}
								className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
								onClick={() => setSlider(false)}
							>
								<span className='mobile-icon'>{item.icon}</span>
								<span>{item.label}</span>
							</NavLink>
						</li>
					))}
				</ul>

				{token !== '' && (
					<div className='mobile-bottom'>
						<button className='mobile-link mobile-logout' onClick={logoutHandler}>
							<span className='mobile-icon'>
								<HiOutlineLogout />
							</span>
							<span>Logout</span>
						</button>
					</div>
				)}
			</div>

			{/* Backdrop for mobile panel */}
			{slider && <div className='backdrop' onClick={() => setSlider(false)} />}
		</>
	);
};

export default Slidebar;
