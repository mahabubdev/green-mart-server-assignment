const router = require('express').Router();

// products
router.use('/products', require('./controllers/products'));

// orders
router.use('/orders', require('./controllers/order'));


module.exports = router;