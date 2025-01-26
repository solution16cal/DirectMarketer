const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    console.log('Token received:', token); // Debug log
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Invalid token:', error.message); // Debug log
    res.status(401).json({ message: 'Token is not valid' });
  }
};