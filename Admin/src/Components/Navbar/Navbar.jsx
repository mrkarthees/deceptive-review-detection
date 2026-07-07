import { useContext } from 'react';
import { DataContext } from '../../Context/Context.jsx';
import { NavLink, useLocation } from 'react-router-dom';
import './navbar.css';

import { FiSearch } from 'react-icons/fi';
import { HiOutlineChevronRight } from 'react-icons/hi2';

const pathLabels = {
	'': 'Collection',
	dashboard: 'Dashboard',
	add: 'Add Product',
	review: 'Reviews',
	product: 'Product',
	login: 'Login',
};

const Navbar = () => {
	const { searchBar, setSearchBar, userInput, setUserInput } =
		useContext(DataContext);
	const location = useLocation();

	if (location.pathname === '/') {
		if (!searchBar) setSearchBar(true);
	} else {
		if (searchBar) setSearchBar(false);
	}

	const segments = location.pathname.split('/').filter(Boolean);
	const crumbs = [
		{ label: 'Collection', to: '/' },
		...segments.map((seg, i) => ({
			label: pathLabels[seg] || seg,
			to: '/' + segments.slice(0, i + 1).join('/'),
		})),
	];

	return (
		<section className='navbar'>
			<div className='navbar-container'>
				<nav>
					<div className='breadcrumb'>
						{crumbs.map((crumb, i) => (
							<span key={crumb.to} className='crumb'>
								{i > 0 && (
									<span className='crumb-sep'>
										<HiOutlineChevronRight />
									</span>
								)}
								{i === crumbs.length - 1 ? (
									<span className='crumb-current'>{crumb.label}</span>
								) : (
									<NavLink to={crumb.to} className='crumb-link'>
										{crumb.label}
									</NavLink>
								)}
							</span>
						))}
					</div>

					<div className={`${searchBar === false ? 'display-none' : 'search-box'}`}>
						<input
							type='text'
							onChange={(e) => setUserInput(e.target.value)}
							value={userInput}
							placeholder='Search'
						/>
						<i>
							<FiSearch />
						</i>
					</div>
				</nav>
			</div>
		</section>
	);
};

export default Navbar;
