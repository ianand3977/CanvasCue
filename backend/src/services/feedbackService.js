// Feedback service: create, list for artwork
const { createFeedback, getFeedbackForArtwork } = require('../models/feedback');

async function createFeedbackService(data, user) {
  if (!user || user.role !== 'curator') return { status: 403, data: { message: 'Only curators can leave feedback' } };
  if (!data.artworkId || !data.comments) return { status: 400, data: { message: 'Artwork and comments required' } };
  const feedback = await createFeedback({ ...data, curatorId: user.id });
  return { status: 201, data: feedback };
}

async function getFeedbackForArtworkService(artworkId) {
  const feedback = await getFeedbackForArtwork(artworkId);
  return { status: 200, data: feedback };
}

module.exports = { createFeedback: createFeedbackService, getFeedbackForArtwork: getFeedbackForArtworkService };
