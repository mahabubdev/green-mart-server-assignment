const route = require('express').Router();
const { Order, Product } = require('../model');
// const myuid = require('myuid');


// GET query all orders
route.get('/', async (req, res) => {

    let { user } = req.query;

    if (! user) {
        return res.status(400).json({
            message: 'User is required'
        });
    }

    let orders = await Order.find({ user });

    res.json(orders);
});



// POST create orders
route.post('/add', async (req, res) => {
    // console.log("body", req.body);
    let { email, pid, cost } = req.body;
    cost = parseFloat(cost);

    if (!email || !pid || !cost) {
        return res.status(400).json({
            message: 'Error! Please send us all info needed'
        });
    }
    // console.log(email, pid);
    const findProduct = await Product.findOne({ pid: pid });
    if (! findProduct) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }
    const newOrder = {
        user: email,   // user email only
        cost,
        products: [
            {
                ...findProduct,
                qty: 1, // default for this assignment
            }
        ], // passing only the ID
    };
    const saveOrder = new Order(newOrder);
    await saveOrder.save()
    .then(data => {
        res.status(201).json({
            message: 'Order placed successfully!',
            data: data
        });
    })
    .catch(err => res.status(400).json({ message: 'Error!', errors: err }))
});


module.exports = route;