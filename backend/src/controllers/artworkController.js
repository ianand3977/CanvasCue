// Artwork controller: create, get, approve, reject, list
const artworkService = require('../services/artworkService');

const createArtwork = async (req, res, next) => {
  try {
    const result = await artworkService.createArtwork(req.body, req.user);
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};

const getArtwork = async (req, res, next) => {
  try {
    const result = await artworkService.getArtwork(req.params.id);
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};

const listArtworks = async (req, res, next) => {
  try {
    // Pass user context for mine/reviewedByMe queries
    const result = await artworkService.listArtworks(req.query, req.user);
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};

const approveArtwork = async (req, res, next) => {
  try {
    const result = await artworkService.approveArtwork(req.params.id, req.user, req.body.feedback);
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};

const rejectArtwork = async (req, res, next) => {
  try {
    const result = await artworkService.rejectArtwork(req.params.id, req.user, req.body.feedback);
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};

module.exports = { createArtwork, getArtwork, listArtworks, approveArtwork, rejectArtwork };
