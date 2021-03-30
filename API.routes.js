const router = require('express').Router();

// products
router.use('/products', require('./controllers/products'));


module.exports = router;