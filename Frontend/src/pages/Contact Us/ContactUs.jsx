import React, { useContext, useEffect, useRef, useState } from 'react';
import { DataContext } from '../../Context/Context';
import './contactUs.css';
import banner from '../../assets/images/Banner.jpg';
import { FaPhoneAlt } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import { FaChevronDown } from 'react-icons/fa';

// Add more images here if you have multiple banners — the slideshow
// will automatically cycle through whatever is in this array.
const bannerImages = [banner];

const ContactUs = () => {
	const { slider, setSlider } = useContext(DataContext);
	const [activeSlide, setActiveSlide] = useState(0);
	const [form, setForm] = useState({ name: '', email: '', message: '' });
	const [sent, setSent] = useState(false);
	const [formInView, setFormInView] = useState(false);
	const contentRef = useRef(null);
	const formRef = useRef(null);

	// auto-advance slideshow
	useEffect(() => {
		if (bannerImages.length <= 1) return;
		const timer = setInterval(() => {
			setActiveSlide((prev) => (prev + 1) % bannerImages.length);
		}, 4000);
		return () => clearInterval(timer);
	}, []);

	// trigger a one-time spark animation on the form when it scrolls into view
	useEffect(() => {
		const node = formRef.current;
		if (!node) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setFormInView(true);
					observer.unobserve(node);
				}
			},
			{ threshold: 0.3 },
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	const scrollToContent = () => {
		contentRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Hook this up to your backend / email service (e.g. axios.post(backendURL + '/contact', form))
		console.log('Contact form submitted:', form);
		setSent(true);
		setForm({ name: '', email: '', message: '' });
		setTimeout(() => setSent(false), 3500);
	};

	return (
		<main className={`${slider == true ? 'container' : 'grid'}`}>
			<section className='contact'>
				{/* ---------- Banner / Slideshow ---------- */}
				<div className='contact-banner'>
					{bannerImages.map((img, index) => (
						<img
							key={index}
							src={img}
							alt="Star's Footwears"
							className={`slide ${index === activeSlide ? 'active' : ''}`}
						/>
					))}
					<div className='banner-overlay'></div>

					<div className='scroll-indicator' onClick={scrollToContent}>
						<span>Scroll</span>
						<FaChevronDown />
					</div>

					{bannerImages.length > 1 && (
						<div className='slide-dots'>
							{bannerImages.map((_, index) => (
								<span
									key={index}
									className={`dot ${index === activeSlide ? 'active' : ''}`}
									onClick={() => setActiveSlide(index)}
								></span>
							))}
						</div>
					)}
				</div>

				{/* ---------- Info + Form ---------- */}

				<div className='contact-content' ref={contentRef}>
					<div className='banner-text'>
						<h1>Contact Us</h1>
						<p>We'd love to hear from you</p>
					</div>
					<div className='info-cards'>
						<div className='info-card'>
							<div className='info-icon'>
								<FaPhoneAlt />
							</div>

							<div className='info-text'>
								<h4>Phone</h4>
								<p>+91 97860 71388</p>
							</div>
						</div>

						<div className='info-card'>
							<div className='info-icon'>
								<FaLocationDot />
							</div>
							<div className='info-text'>
								<h4>Address</h4>
								<p>
									Star's Footwears, 358, Railway Feeder Road, Virudhunagar, Tamilnadu,
									626001, India
								</p>
							</div>
						</div>

						<div className='info-card'>
							<div className='info-icon'>
								<MdEmail />
							</div>
							<div className='info-text'>
								<h4>Email</h4>
								<p>support@starsfootwears.com</p>
							</div>
						</div>
					</div>

					<form
						className={`contact-form ${formInView ? 'spark' : ''}`}
						ref={formRef}
						onSubmit={handleSubmit}
					>
						<h1>Send a Message</h1>
						<div className='form-row'>
							<div className='form-group'>
								<label htmlFor='name'>Name</label>
								<input
									type='text'
									id='name'
									name='name'
									placeholder='Your name'
									value={form.name}
									onChange={handleChange}
									required
								/>
							</div>
							<div className='form-group'>
								<label htmlFor='email'>Email</label>
								<input
									type='email'
									id='email'
									name='email'
									placeholder='you@example.com'
									value={form.email}
									onChange={handleChange}
									required
								/>
							</div>
						</div>

						<div className='form-group'>
							<label htmlFor='message'>What can we do for you?</label>
							<textarea
								id='message'
								name='message'
								rows='5'
								placeholder='Tell us how we can help...'
								value={form.message}
								onChange={handleChange}
								required
							></textarea>
						</div>

						<button type='submit'>{sent ? 'Message Sent ✓' : 'Send Message'}</button>
					</form>
				</div>
			</section>
		</main>
	);
};

export default ContactUs;
