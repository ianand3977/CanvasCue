// User controller: registration, login, OTP, profile
const userService = require('../services/userService');

const register = async (req, res, next) => {
  try {
    console.log('[userController] Register request body:', req.body);
    const result = await userService.register(req.body);
    console.log('[userController] Register result:', result);
    res.status(result.status).json(result.data);
  } catch (err) {
    console.error('[userController] Register error:', err);
    next(err);
  }
};

const requestOtp = async (req, res, next) => {
  try {
    console.log('[userController] Request OTP for:', req.body.email);
    const result = await userService.requestOtp(req.body.email);
    console.log('[userController] Request OTP result:', result);
    res.status(result.status).json(result.data);
  } catch (err) {
    console.error('[userController] Request OTP error:', err);
    next(err);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    console.log('[userController] Verify OTP body:', req.body);
    const result = await userService.verifyOtp(req.body);
    console.log('[userController] Verify OTP result:', result);
    res.status(result.status).json(result.data);
  } catch (err) {
    // Handle DB errors for invalid/expired OTP gracefully
    if (err.message && err.message.includes('client password must be a string')) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    console.error('[userController] Verify OTP error:', err);
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    // req.user is set by authenticateJWT middleware
    const userId = req.user.id;
    const result = await userService.getUserById(userId);
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, requestOtp, verifyOtp, login, me };
