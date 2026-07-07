import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../Context/Context';
import './thankyou.css';

const Thankyou = () => {
	const { slider } = useContext(DataContext);
	const navigate = useNavigate();

	// confetti pieces with randomized position/delay/color
	const confetti = Array.from({ length: 18 }).map((_, i) => ({
		id: i,
		left: Math.random() * 100,
		delay: Math.random() * 1.2,
		duration: 2.2 + Math.random() * 1.5,
		color: ['var(--accent)', 'var(--accent-500)', 'var(--accent-200)', '#ffb300'][
			i % 4
		],
	}));

	return (
		<main className={`${slider == true ? 'container' : 'grid'}`}>
			<section className='thankyou'>
				<div className='thankyou-card'>
					<div className='confetti-wrap'>
						{confetti.map((c) => (
							<span
								key={c.id}
								className='confetti'
								style={{
									left: `${c.left}%`,
									animationDelay: `${c.delay}s`,
									animationDuration: `${c.duration}s`,
									backgroundColor: c.color,
								}}
							/>
						))}
					</div>

					<div className='check-circle'>
						<svg viewBox='0 0 60 60' className='check-svg'>
							<circle className='check-circle-bg' cx='30' cy='30' r='27' />
							<path className='check-mark' d='M17 31 L26 40 L44 20' />
						</svg>
					</div>

					<h1>Order Placed!</h1>
					<p className='subtitle'>
						Thank you for shopping with us. Your order is being prepared for delivery.
					</p>

					<div className='delivery-scene'>
						<svg viewBox='0 0 220 90' className='truck-svg'>
							<g className='truck-group'>
								{/* truck body */}
								<rect
									x='10'
									y='30'
									width='90'
									height='35'
									rx='4'
									className='truck-body'
								/>
								<rect
									x='100'
									y='42'
									width='45'
									height='23'
									rx='3'
									className='truck-cabin'
								/>
								<rect
									x='110'
									y='47'
									width='18'
									height='12'
									rx='1'
									className='truck-window'
								/>
								{/* exhaust puffs */}
								<circle className='puff puff-1' cx='8' cy='32' r='4' />
								<circle className='puff puff-2' cx='0' cy='30' r='3' />
								{/* wheels */}
								<g className='wheel wheel-back'>
									<circle cx='35' cy='68' r='11' />
									<circle cx='35' cy='68' r='4' className='hub' />
								</g>
								<g className='wheel wheel-front'>
									<circle cx='120' cy='68' r='11' />
									<circle cx='120' cy='68' r='4' className='hub' />
								</g>
							</g>
						</svg>
						<div className='road'></div>
					</div>

					<button onClick={() => navigate('/shop')}>Go To Shopping</button>
				</div>
			</section>
		</main>
	);
};

export default Thankyou;
