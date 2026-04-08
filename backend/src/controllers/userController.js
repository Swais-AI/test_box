const db = require('../config/db');

const getMe = async (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    user_type: req.user.user_type,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    phone_number: req.user.phone_number,
    dob: req.user.dob
  });
};

const register = async (req, res) => {
  const { user_type, first_name, last_name, phone_number, dob } = req.body;
  const validTypes = ['LOGISTICS', 'WAREHOUSING', 'ECOMMERCE', 'MANUFACTURING', 'BANKING', 'HEALTHCARE', 'EDUTECH'];

  if (!validTypes.includes(user_type)) {
    return res.status(400).json({ message: 'Invalid user_type' });
  }

  try {
    const updatedUser = db.updateUser(req.user.email, {
      user_type,
      first_name,
      last_name,
      phone_number,
      dob
    });

    res.json({
      message: 'Registration complete',
      user: updatedUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateIndustry = async (req, res) => {
  // For backwards compatibility with the frontend's PUT /api/user/update-industry
  const { industry } = req.body;
  try {
    const updatedUser = db.updateUser(req.user.email, { user_type: industry.toUpperCase() });
    res.json({ message: 'Industry updated', user_type: updatedUser.user_type });
  } catch(err) {
    res.status(500).json({ message: 'Failed to update industry' });
  }
}

module.exports = {
  getMe,
  register,
  updateIndustry
};
