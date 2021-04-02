const route = require('express').Router();
const { Product } = require('../model');
const multer = require('multer');
const myuid = require('myuid');
const fs = require('fs');
const path = require('path');

/**=================*
 * Multer setup
 *=================*/
const uploader = multer({ dest: 'uploads/' }).single('photo');


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

    let reqUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    let baseDomain = reqUrl.replace(req.originalUrl, '');

    const newProduct = {
        name, price, weight,
        pid: myuid(),
        photo: `${baseDomain}/file/${req.file.filename}`
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
        .then((d) => {
            let productPhoto = d._doc.photo;
            let photoFile = productPhoto.split('/')[4];

            fs.unlink(path.resolve(__dirname, '../uploads/' + photoFile), () => {
                res.status(202).json({
                    message: 'Product removed successfully!'
                });
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