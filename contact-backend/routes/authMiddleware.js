const jwt = require('jsonwebtoken');
const JWT_SECRET = 'francisgalway' || 'default_secret_key';

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Set the decoded user info in the request
    next();
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};