const express = require('express');
const { createPolicy, getPolicyById, getAllPolicy, assginPolicy, countPolicy, updatePolicy, getMyPolicy, policyDownload } = require('../controllers/policy.controller');
const { protect } = require('../middleware/protect.middleware');
const { authRole } = require('../middleware/authRoles.middleware');


const router = express.Router()

router.post('/:id/create-policy', protect, authRole(['Agent']), createPolicy)
router.get('/progress', protect, authRole(['Admin', 'Agent']), countPolicy)
router.get('/my-policy', protect, authRole(['Customer']), getMyPolicy)
router.get('/:policyId/download', protect, authRole(['Customer']), policyDownload)
router.get('/', protect, getAllPolicy)
router.get('/policy/:id', protect, authRole(['Agent', 'Customer', "Admin"]), getPolicyById)
router.patch('/:id/update', protect, authRole(['Agent']), updatePolicy)
// router.post('/policy/assign/:id', protect, authRole(['Agent']), assginPolicy)



module.exports = router