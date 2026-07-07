import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { backendURL } from '../../App';
import { DataContext } from '../../Context/Context';
import './updateProduct.css';
import { HiOutlinePhoto } from 'react-icons/hi2';

const UpdateProduct = ({ token }) => {
	const navigate = useNavigate();
	const { currency } = useContext(DataContext);
	const { productId } = useParams();
	const [product, setProduct] = useState([]);
	const [imgOne, setImgOne] = useState(false);
	const [name, setName] = useState('');
	const [price, setPrice] = useState('');
	const [description, setDescription] = useState('');
	const [offer, setOffer] = useState('');
	const [stock, setStock] = useState('Stock');
	const [brand, setBrand] = useState('');
	const [category, setCategory] = useState('Bangle');

	const eachProduct = async () => {
		const response = await axios.get(backendURL + '/product/list', {
			headers: { token },
		});
		response.data.Products.map((item) => {
			if (item._id === productId) {
				setProduct(item);
				setName(item.name);
				setPrice(item.price);
				setOffer(item.offer);
				setBrand(item.brand);
				setDescription(item.description);
				setStock(item.stock);
				setCategory(item.category);
				return null;
			}
		});
	};

	useEffect(() => {
		eachProduct();
	}, []);

	const onSubmitHandler = async (e) => {
		e.preventDefault();
		try {
			const formData = new FormData();
			formData.append('name', name);
			formData.append('price', price);
			formData.append('description', description);
			formData.append('stock', stock);
			formData.append('brand', brand);
			formData.append('category', category);
			formData.append('offer', offer);
			imgOne && formData.append('imgOne', imgOne);
			const response = await axios.put(
				backendURL + `/product/update/${productId}`,
				formData,
				{
					headers: { token },
				},
			);

			if (response.data.result) {
				setImgOne(false);
				console.log(response.data.heed);
			} else {
				console.log(response.data.mistake);
			}
		} catch (error) {
			console.error(error.message);
		}
	};

	const deleteHandler = async () => {
		try {
			const response = await axios.delete(
				backendURL + `/product/delete/${productId}`,
				{
					headers: { token },
				},
			);
			if (response.data.result) {
				console.log(response.data.heed);
			}
			navigate('/');
		} catch (error) {
			console.error(error.message);
		}
	};

	return (
		<main className='product-page'>
			<div className='product-page-head'>
				<h1>Update Product</h1>
				<p>Edit the details for this item.</p>
			</div>

			<section className='product-form-wrap'>
				<form onSubmit={onSubmitHandler}>
					<div className='form-grid'>
						{/* left panel */}
						<div className='panel panel-left'>
							<label htmlFor='file' className='image-upload'>
								{!imgOne ? (
									product.image?.[0] ? (
										<img src={product.image[0]} alt={name} />
									) : (
										<span className='image-upload-empty'>
											<HiOutlinePhoto />
											<span>Upload Image</span>
										</span>
									)
								) : (
									<>
										<img src={URL.createObjectURL(imgOne)} alt='preview' />
										<span className='image-upload-overlay'>Change Image</span>
									</>
								)}
							</label>
							<input
								onChange={(e) => setImgOne(e.target.files[0])}
								type='file'
								id='file'
								hidden
							/>

							<div className='field-row'>
								<div className='field'>
									<label>Price</label>
									<input
										onChange={(e) => setPrice(e.target.value)}
										value={price}
										type='number'
										placeholder='₹ 100'
									/>
								</div>
								<div className='field'>
									<label>Offer</label>
									<input
										onChange={(e) => setOffer(e.target.value)}
										value={offer}
										type='number'
										placeholder='20 %'
									/>
								</div>
							</div>

							<div className='field'>
								<label>Brand</label>
								<input
									onChange={(e) => setBrand(e.target.value)}
									value={brand}
									type='text'
									placeholder='Stars'
								/>
							</div>
						</div>

						{/* right panel */}
						<div className='panel panel-right'>
							<div className='field'>
								<label>Name</label>
								<input
									onChange={(e) => setName(e.target.value)}
									value={name}
									type='text'
									placeholder='Elegance Bangle'
								/>
							</div>

							<div className='field-row field-row-split'>
								<div className='field stock-field'>
									<label>Stock</label>
									<div className='stock-options'>
										<label className='stock-option'>
											<input
												name='stock'
												type='radio'
												value='Stock'
												checked={stock === 'Stock'}
												onChange={(e) => setStock(e.target.value)}
											/>
											In Stock
										</label>
										<label className='stock-option'>
											<input
												name='stock'
												type='radio'
												value='No Stock'
												checked={stock === 'No Stock'}
												onChange={(e) => setStock(e.target.value)}
											/>
											Out Of Stock
										</label>
									</div>
								</div>

								<div className='field'>
									<label>Category</label>
									<select onChange={(e) => setCategory(e.target.value)} value={category}>
										<option value='Bangle'>Bangle</option>
										<option value='Wallet'>Wallet</option>
									</select>
								</div>
							</div>

							<div className='field field-grow'>
								<label>Description</label>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder='Beautiful Nice'
								/>
							</div>
						</div>
					</div>

					<div className='form-actions'>
						<button className='btn btn-danger' onClick={deleteHandler} type='button'>
							Delete
						</button>
						<NavLink to='/'>
							<button className='btn btn-outline' type='button'>
								Cancel
							</button>
						</NavLink>
						<button className='btn btn-primary' type='submit'>
							Update
						</button>
					</div>
				</form>
			</section>
		</main>
	);
};

export default UpdateProduct;
