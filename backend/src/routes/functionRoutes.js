const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  const allFunctions = [
    'LOGISTICS',
    'WAREHOUSING',
    'ECOMMERCE',
    'MANUFACTURING',
    'BANKING',
    'HEALTHCARE',
    'EDUTECH'
  ];

  const userType = req.user.user_type;

  const response = allFunctions.map(func => ({
    name: func,
    enabled: func === userType
  }));

  res.json(response);
});

module.exports = router;
