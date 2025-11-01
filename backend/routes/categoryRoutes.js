const express = require('express');

const router = express.Router();
const {categories} = require('../controllers/categoryController');

router.get('/:category',categories);

module.exports = router;