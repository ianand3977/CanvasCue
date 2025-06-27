const express = require('express');
const tagController = require('../controllers/tagController');
const { authenticateJWT, requireRole } = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /tag:
 *   post:
 *     summary: Create tag (curator only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tag created
 *       403:
 *         description: Only curators can create tags
 *   get:
 *     summary: List all tags
 *     responses:
 *       200:
 *         description: List of tags
 */

// Create tag (curator only)
router.post('/', authenticateJWT, requireRole('curator'), tagController.createTag);
// List all tags
router.get('/', tagController.listTags);

module.exports = router;
