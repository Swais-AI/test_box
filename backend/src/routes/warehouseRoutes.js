const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// All warehouse routes require Authentication and WAREHOUSING role
// Note: In the existing frontend, the industry can be mixed case, e.g., 'Warehouse'. We map everything to uppercase ('WAREHOUSING')
router.use(authMiddleware);
// The existing frontend calls the industry 'Warehouse', so let's allow either to be safe, or just stick to WAREHOUSING
// We'll enforce that user_type has to be WAREHOUSING or WAREHOUSE
router.use((req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Authentication required' });
  const type = (req.user.user_type || '').toUpperCase();
  if (type !== 'WAREHOUSING' && type !== 'WAREHOUSE') {
    return res.status(403).json({ message: 'Access Forbidden: Requires WAREHOUSING module access' });
  }
  next();
});

router.get('/menu', (req, res) => {
  res.json([
    "INBOUND RECEIVING",
    "OUTBOUND SHIPMENTS",
    "RETURNS",
    "REPLENISHMENTS",
    "CYCLE COUNT",
    "MIS REPORTS"
  ]);
});

// We route /api/warehouse-data here to serve existing frontend dashboard
router.get('/data', (req, res) => {
  res.json({
    analytics: {
      weeklyRevenue: 45000,
      activeWorkers: 34
    },
    orders: [
      { id: "ORD-123", customer: "John Doe", status: "Delivered", date: "2026-04-08" },
      { id: "ORD-124", customer: "Jane Smith", status: "Processing", date: "2026-04-09" }
    ],
    inventory: [
      { id: "1", item: "Forklift parts", quantity: 12, status: "In Stock" },
      { id: "2", item: "Pallets", quantity: 2, status: "Low Stock" }
    ]
  });
});

module.exports = router;
