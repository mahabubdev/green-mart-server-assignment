const router = require('express').Router();


// get '/'
router.get('/', (req, res) => {
    res.send(`<h1>Hi...!</h1>`);
})


module.exports = router;