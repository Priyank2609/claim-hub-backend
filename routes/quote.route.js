

const express = require('express');
const { protect } = require('../middleware/protect.middleware');
const { authRole } = require('../middleware/authRoles.middleware');
const { createQuote, getAllQuotes } = require('../controllers/quote.controller');
const router = express.Router()


router.post('/create-qoute', protect, authRole(['Customer']), createQuote)
router.get('/', protect, authRole(['Agent']), getAllQuotes)


module.exports = router