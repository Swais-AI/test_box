const roleMiddleware = (requiredUserType) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.user_type !== requiredUserType) {
      return res.status(403).json({ message: `Access Forbidden: Requires ${requiredUserType} module access` });
    }

    next();
  };
};

module.exports = roleMiddleware;
