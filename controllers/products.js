const route = require('express').Router();
const { Product } = require('../model');
const multer = require('multer');
const myuid = require('myuid');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

/**=================*
 * Multer setup
 *=================*/
const uploader = multer({ dest: 'uploads/' }).single('photo');


/**=================*
 * Cloudinary setup
 *=================*/
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// GET query all products
route.get('/', async (req, res) => {
    let { search } = req.query;
    let query = {};

    if (search) {
        query = {
            name: {
                $regex: search,
                $options: '$i'
            }
        }
    }

    let products = await Product.find(query);
    res.json(products);
});


// POST create a product
route.post('/add', uploader,  async (req, res) => {
    // console.log("console ===> ", req.body);

    let { name, price, weight } = req.body;
    price = parseFloat(price);

    // uploading to cloudinary
    const cloudUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: 'webdev3_assignment10'
    });

    // let reqUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    // let baseDomain = reqUrl.replace(req.originalUrl, '');

    const newProduct = {
        name, price, weight,
        pid: myuid(),
        photo: cloudUpload.secure_url,
        cloud_id: cloudUpload.public_id
    };
    const product = new Product(newProduct);
    product.save()
    .then(data => {
        res.status(201).json(data)
    })
    .catch(err => {
        console.log(err)
        res.status(400).json(err)
    })
});


route.delete('/del/:pid', async (req, res) => {
    const { pid } = req.params;
    const fetchProduct = await Product.findOne({ pid });
    if (fetchProduct) {
        // res.json(fetchProduct)
        await fetchProduct.delete()
        .then(async (d) => {
            // console.log(d)
            await cloudinary.uploader.destroy(fetchProduct.cloud_id)
            res.status(202).json({
                message: 'Product deleted successfully!',
                data: {
                    pid,
                    name: fetchProduct.name,
                }
            })
        })
        .catch(err => res.status(400).json({ message: err.message }))
    } else {
        // 404
        res.status(404).json({
            message: 'Product not found!'
        })
    }
})


module.exports = route;