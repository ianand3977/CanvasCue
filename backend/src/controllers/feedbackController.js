// Feedback controller: create, list for artwork
const feedbackService = require('../services/feedbackService');

const createFeedback = async (req, res, next) => {
  try {
    const result = await feedbackService.createFeedback(req.body, req.user);
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};

const getFeedbackForArtwork = async (req, res, next) => {
  try {
    const result = await feedbackService.getFeedbackForArtwork(req.params.artworkId);
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};

module.exports = { createFeedback, getFeedbackForArtwork };
