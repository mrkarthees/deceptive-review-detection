import { v2 as cloudinary } from 'cloudinary';
import { Product } from '../models/productModel.js';

export const listController = async (req, res) => {
	try {
		const Products = await Product.find({});
		res.json({
			heed: 'All products have been fetched successfully',
			result: true,
			Products,
		});
	} catch (error) {
		res.json({
			mistake: error.message,
			result: false,
		});
	}
};
export const addController = async (req, res) => {
	try {
		const { name, price, description, category, stock, brand, offer } = req.body;
		const imgOne = req.files.imgOne && req.files.imgOne[0];
		const images = [imgOne].filter((item) => item !== undefined);
		let imgURL = await Promise.all(
			images.map(async (item) => {
				let result = await cloudinary.uploader.upload(item.path);
				return result.secure_url;
			}),
		);

		const newProduct = new Product({
			name,
			price,
			description,
			category,
			stock,
			brand,
			offer,
			image: imgURL,
		});
		await newProduct.save();

		res.json({
			heed: 'Product successfully added to the database.',
			result: true,
		});
	} catch (error) {
		res.json({
			mistake: error.message,
			result: false,
		});
	}
};

export const updateController = async (req, res) => {
	try {
		const productId = req.params.id;
		const { name, price, description, category, stock, brand, offer } = req.body;

		const existingProduct = await Product.findById(productId);
		if (!existingProduct) {
			return res.json({
				result: false,
				mistake: 'Product not found',
			});
		}

		const imgOne = req.files?.imgOne && req.files.imgOne[0];
		const images = [imgOne].filter((item) => item !== undefined);

		let imgURL;

		if (images.length > 0) {
			// New image uploaded — upload to cloudinary and use it
			imgURL = await Promise.all(
				images.map(async (item) => {
					let result = await cloudinary.uploader.upload(item.path);
					return result.secure_url;
				}),
			);
		} else if (req.body.image) {
			// No new file — frontend sent back the existing image URL(s)
			try {
				imgURL = JSON.parse(req.body.image);
			} catch (e) {
				imgURL = existingProduct.image;
			}
		} else {
			// Nothing sent at all — keep whatever was already in the DB
			imgURL = existingProduct.image;
		}

		const updateProduct = await Product.findByIdAndUpdate(
			productId,
			{
				name,
				price,
				description,
				category,
				stock,
				brand,
				offer,
				image: imgURL,
			},
			{ new: true },
		);

		res.json({
			heed: 'Product updated successfully',
			result: true,
			updateProduct,
		});
	} catch (error) {
		res.json({
			mistake: error.message,
			result: false,
		});
	}
};

export const deleteController = async (req, res) => {
	try {
		const productId = req.params.id;
		const deleteProduct = await Product.findByIdAndDelete(productId);
		res.json({
			heed: 'Product delete successfully',
			result: true,
		});
	} catch (error) {
		res.json({
			mistake: error.message,
			result: false,
		});
	}
};
export const oneItemController = async (req, res) => {
	try {
		const productName = req.body;
		const findProduct = await Product.findOne(productName);

		res.json({
			heed: 'Product Found',
			result: true,
			findProduct,
		});
	} catch (error) {
		res.json({
			mistake: error.message,
			result: false,
		});
	}
};
