const express = require('express');
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password, role]
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [artist, curator]
 *               bio:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Bad request
 *       409:
 *         description: User already exists
 *
 * /user/request-otp:
 *   post:
 *     summary: Request OTP for login/registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent
 *
 * /user/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 *       400:
 *         description: Invalid or expired OTP
 *
 * /user/login:
 *   post:
 *     summary: Login with OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token
 *       400:
 *         description: Invalid or expired OTP
 *
 * /user/profile:
 *   get:
 *     summary: Get user profile (JWT required)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */

// Registration (with password fallback for now)
router.post('/register', userController.register);
// Request OTP for login/registration
router.post('/request-otp', userController.requestOtp);
// Verify OTP
router.post('/verify-otp', userController.verifyOtp);
// Login with OTP
router.post('/login', userController.login);
// Example: get profile (protected)
router.get('/profile', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});
// New: get current user info (protected)
router.get('/me', authenticateJWT, userController.me);

module.exports = router;
