const express = require('express');
const { createClaim, getAllClaim, getClaimById, countClaim, getClaimPerCustomer, claimSummary, updateStatus, claimByMonth, getMyClaim } = require('../controllers/claim.controller');
const { protect } = require('../middleware/protect.middleware');
const { authRole } = require('../middleware/authRoles.middleware');

const router = express.Router()



router.post('/create', protect, authRole(['Customer']), createClaim)

router.get('/my-claim', protect, authRole(['Customer']), getClaimPerCustomer)
router.get('/summary', protect, authRole(["Claim Officer", 'Admin', 'Agent']), claimSummary)

router.get('/claim-month', protect, authRole(['Admin', 'Claim Officer']), claimByMonth)
router.get('/', protect, authRole(['Claim Officer', 'Admin']), getAllClaim)
router.get('/:id', protect, authRole(['Customer', "Claim Officer", 'Admin']), getClaimById)
router.patch('/update/:id', protect, authRole(['Claim Officer']), updateStatus)



module.exports = router