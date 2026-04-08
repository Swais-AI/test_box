const jwt = require('jsonwebtoken');

const googleCallback = (req, res) => {
  if (!req.user) {
    return res.redirect('http://localhost:3000?error=auth_failed');
  }

  const token = jwt.sign(
    { id: req.user.id, email: req.user.email, user_type: req.user.user_type },
    process.env.JWT_SECRET || 'secret123',
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  if (!req.user.user_type) {
    // New user or incomplete registration
    return res.redirect('http://localhost:3000/dashboard'); // The frontend logic will pop up the ChangeIndustryModal since industry/user_type is null
  }

  // Registered user
  res.redirect('http://localhost:3000/dashboard');
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

module.exports = {
  googleCallback,
  logout
};
