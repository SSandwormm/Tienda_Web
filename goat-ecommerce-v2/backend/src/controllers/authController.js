const authService = require('../services/authService');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const data = await authService.login({ email, password });
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const data = await authService.register({ name, email, password });
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = { login, register };