const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByUsername } = require('../models/user');
const winston = require('winston');

const router = express.Router();
const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Username and password required
 *       409:
 *         description: User already exists
 *       500:
 *         description: Server error
 */

// Register
router.post('/register', async (req, res) => {
  logger.info('POST /api/auth/register called', { body: req.body });
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  try {
    const existingUser = await findUserByUsername(username);
    if (existingUser) return res.status(409).json({ message: 'User already exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser(username, passwordHash);
    res.status(201).json({ id: user.id, username: user.username });
  } catch (err) {
    logger.error('Register error', { error: err });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token
 *       400:
 *         description: Username and password required
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

// Login
router.post('/login', async (req, res) => {
  logger.info('POST /api/auth/login called', { body: req.body });
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  try {
    const user = await findUserByUsername(username);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    logger.error('Login error', { error: err });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
