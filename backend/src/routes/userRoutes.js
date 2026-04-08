const express = require('express');
const { getMe, register, updateIndustry } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All user routes are protected
router.use(authMiddleware);

router.get('/me', getMe);
router.post('/register', register);
router.put('/update-industry', updateIndustry); // Needed by existing frontend

module.exports = router;
