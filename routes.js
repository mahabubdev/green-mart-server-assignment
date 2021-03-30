const router = require('express').Router();
const path = require('path');


// get '/'
router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './views/index.html'));
});


// API endpoints /api
router.use('/api', require('./API.routes'));


module.exports = router;