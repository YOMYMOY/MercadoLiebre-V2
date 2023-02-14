const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	
	index: (req, res) => {
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		return res.render('products', {
			products,
			toThousand
		});
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
		const {id} = req.params;
		const product = products.find(product => product.id === +id);
		return res.render('detail', {
			...product,
			toThousand
		});
	},

	// Create - Form to create
	create: (req, res) => {
		return res.render('product-create-form');
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const {name, description, price, discount, category} = req.body;
		const newProduct = {
			id : products.length ? products[products.length -1].id +1 : 1,
			name : name.trim(),
			description : description.trim(),
			price : +price,
			discount : +discount,
			image : req.files?.image[0]?.filename || null,
			images : req.files?.images?.map(file => file.filename) || [],
			category,
		}
		products.push(newProduct);

    	fs.writeFileSync(productsFilePath,JSON.stringify(products, null, 3), 'UTF-8');

    	return res.redirect('/products');
	},

	// Update - Form to edit
	edit: (req, res) => {
		const {id} = req.params;
		const product = products.find(product => product.id === +id);
		return res.render('product-edit-form', {
			...product
		});
	},
	// Update - Method to update
	update: (req, res) => {
		const {id} = req.params;
		const {name, description, price, discount, category} = req.body;
		const product = products.find(product => product.id === +id);
		
		const productUpdate = {
			id : +id,
			name : name.trim(),
			description : description.trim(),
			price : +price,
			discount : +discount,
			image : req.files && req.files.image ? req.files.image[0].filename : product.image,
			images : req.files?.images?.map(file => file.filename) || product.images,
			category,
		};
		console.log(productUpdate);
		const productsUpdate = products.map(product => {
			if(product.id === +id){
				return productUpdate;
			}
			return product;
		});

		fs.writeFileSync(productsFilePath,JSON.stringify(productsUpdate, null, 3), 'UTF-8');

		/* return res.redirect('/products'); */
  		return res.redirect(`/products/${id}`);
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		const {id} = req.params;

		const productsUpdate = products.filter(product => product.id !== +id);

		fs.writeFileSync(productsFilePath,JSON.stringify(productsUpdate, null, 3), 'UTF-8');

		return res.redirect('/products');
	},

};

module.exports = controller;