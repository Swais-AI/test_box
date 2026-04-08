const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('dotenv').config();

// Config imports
require('./config/passport'); 

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const functionRoutes = require('./routes/functionRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // Allow cookies
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Routes Setup
app.use('/auth', authRoutes);
app.use('/user', userRoutes); // E.g., /user/me, /user/register
app.use('/functions', functionRoutes);
app.use('/warehouse', warehouseRoutes);

app.use('/api/warehouse-data', (req, res, next) => {
  req.url = '/data';
  warehouseRoutes(req, res, next);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
