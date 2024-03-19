const express = require('express');
const router = express.Router();

const {fetchData} = require('../controllers/data');

router.get('/', fetchData );

module.exports = router;