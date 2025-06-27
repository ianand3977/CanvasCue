const express = require('express');
const artworkController = require('../controllers/artworkController');
const { authenticateJWT, requireRole } = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const router = express.Router();
const upload = multer({ storage: multer.diskStorage({}) });

/**
 * @swagger
 * /artwork:
 *   post:
 *     summary: Submit new artwork (artist only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, imageUrl]
 *             properties:
 *               title:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               description:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Artwork submitted
 *       400:
 *         description: Bad request
 *       403:
 *         description: Only artists can submit artwork
 *   get:
 *     summary: List all artworks
 *     responses:
 *       200:
 *         description: List of artworks
 *
 * /artwork/{id}:
 *   get:
 *     summary: Get artwork by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Artwork details
 *       404:
 *         description: Not found
 *
 * /artwork/{id}/approve:
 *   post:
 *     summary: Approve artwork (curator only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Artwork approved
 *       403:
 *         description: Only curators can approve
 *
 * /artwork/{id}/reject:
 *   post:
 *     summary: Reject artwork (curator only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Artwork rejected
 *       403:
 *         description: Only curators can reject
 *
 * /artwork/upload:
 *   post:
 *     summary: Upload artwork image to Cloudinary
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Upload failed
 */

// Create artwork (artist only, with image upload)
router.post('/', authenticateJWT, requireRole('artist'), upload.single('image'), async (req, res, next) => {
  try {
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'artworks' });
      imageUrl = result.secure_url;
    }
    req.body.imageUrl = imageUrl;
    // Forward to controller with updated req.body
    req.body.title = req.body.title;
    req.body.description = req.body.description;
    req.body.tags = req.body.tags;
    // The controller expects (req, res, next)
    return artworkController.createArtwork(req, res, next);
  } catch (err) {
    next(err);
  }
});
// Get artwork by id
router.get('/:id', artworkController.getArtwork);
// List all artworks (public, but require auth for mine/reviewedByMe)
router.get('/', (req, res, next) => {
  if (req.query.mine === 'true' || req.query.reviewedByMe === 'true') {
    return require('../middleware/auth').authenticateJWT(req, res, () => {
      require('../controllers/artworkController').listArtworks(req, res, next);
    });
  } else {
    return require('../controllers/artworkController').listArtworks(req, res, next);
  }
});
// Approve artwork (curator only)
router.post('/:id/approve', authenticateJWT, requireRole('curator'), artworkController.approveArtwork);
// Reject artwork (curator only)
router.post('/:id/reject', authenticateJWT, requireRole('curator'), artworkController.rejectArtwork);
// Upload artwork image to Cloudinary
router.post('/upload', authenticateJWT, requireRole('artist'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'artworks' });
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

module.exports = router;
