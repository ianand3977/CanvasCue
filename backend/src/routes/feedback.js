const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const { authenticateJWT, requireRole } = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Leave feedback (curator only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [artworkId, comments, rating]
 *             properties:
 *               artworkId:
 *                 type: integer
 *               comments:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Feedback submitted
 *       403:
 *         description: Only curators can leave feedback
 *
 * /feedback/artwork/{artworkId}:
 *   get:
 *     summary: Get feedback for artwork
 *     parameters:
 *       - in: path
 *         name: artworkId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of feedback for artwork
 */

// Create feedback (curator only)
router.post('/', authenticateJWT, requireRole('curator'), feedbackController.createFeedback);
// Get feedback for artwork
router.get('/artwork/:artworkId', feedbackController.getFeedbackForArtwork);

module.exports = router;
