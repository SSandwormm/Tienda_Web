const tokenService = require('../services/tokenService');
const authService = require('../services/authService');

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const payload = tokenService.verifyToken(token);
    const user = authService.getUserById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { authenticate };