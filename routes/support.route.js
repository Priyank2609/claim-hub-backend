

const express = require('express');
const { getSupport } = require('../controllers/support.controller');

const router = express.Router()


router.post('/create', getSupport)

module.exports = router