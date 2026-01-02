const express = require('express');
const { register, login, logout, userDetail, changePassword, getAllUser } = require('../controllers/user.controller');
const { protect } = require('../middleware/protect.middleware');
const { authRole } = require('../middleware/authRoles.middleware');


const router = express.Router()


router.post('/register', register)
router.post('/login', login)
router.get('/user-detail', protect, userDetail)
router.get('/all-user', protect, authRole(['Admin']), getAllUser)
router.post('/logout', protect, logout)
router.patch('/change-password', protect, changePassword)


module.exports = router