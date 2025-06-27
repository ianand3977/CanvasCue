// Artwork service: create, get, approve, reject, list
const { createArtwork, getArtworkById, getAllArtworks, getArtworksByStatus, approveArtworkById, rejectArtworkById, getArtworksByArtist, getArtworksReviewedByCurator } = require('../models/artwork');
const { createArtworkTag, getTagsForArtwork, getTagNamesForArtwork } = require('../models/artworkTag');
const { getTagByName, createTag } = require('../models/tag');
const { findUserById } = require('../models/user');

async function createArtworkService(data, user) {
  if (!user || user.role !== 'artist') return { status: 403, data: { message: 'Only artists can submit artwork' } };
  if (!data.title || !data.imageUrl) return { status: 400, data: { message: 'Title and image required' } };
  // Parse tags string to array if needed
  let tags = data.tags;
  if (typeof tags === 'string') {
    tags = tags.split(',').map(t => t.trim()).filter(Boolean);
  }
  // Map tag names to tag IDs, create tags if not exist
  const tagIds = [];
  for (const tagName of tags) {
    let tag = await getTagByName(tagName);
    if (!tag) tag = await createTag(tagName);
    tagIds.push(tag.id);
  }
  const artwork = await createArtwork({ ...data, tags: tagIds, submittedBy: user.id });
  // Link artwork to tags in artwork_tag table
  for (const tagId of tagIds) {
    await createArtworkTag(artwork.id, tagId);
  }
  // Send email notification to artist
  const { sendArtworkSubmissionEmail } = require('../utils/email');
  await sendArtworkSubmissionEmail(user.email, artwork);
  return { status: 201, data: artwork };
}

async function getArtwork(id) {
  const artwork = await getArtworkById(id);
  if (!artwork) return { status: 404, data: { message: 'Artwork not found' } };
  return { status: 200, data: artwork };
}

async function listArtworks(query, user) {
  let artworks;
  if (query.mine === 'true' && user) {
    artworks = await getArtworksByArtist(user.id);
  } else if (query.reviewedByMe === 'true' && user) {
    artworks = await getArtworksReviewedByCurator(user.id);
  } else if (query.status) {
    artworks = await getArtworksByStatus(query.status);
  } else {
    artworks = await getAllArtworks();
  }
  // Attach tag names and artist info to each artwork
  const { findUserById } = require('../models/user');
  const { getFeedbackForArtwork } = require('../models/feedback');
  for (const art of artworks) {
    art.tags = await getTagNamesForArtwork(art.id);
    const artist = art.submitted_by ? await findUserById(art.submitted_by) : null;
    art.artist_name = artist ? artist.full_name : null;
    art.artist_email = artist ? artist.email : null;
    // Attach all feedbacks for this artwork
    art.feedbacks = await getFeedbackForArtwork(art.id);
  }
  return { status: 200, data: artworks };
}

// Approve/reject logic would update status, set approvedBy, approvedAt
async function approveArtwork(id, user, feedback) {
  if (!user || user.role !== 'curator') return { status: 403, data: { message: 'Only curators can approve artwork' } };
  const artwork = await approveArtworkById(id, user.id);
  if (!artwork) return { status: 404, data: { message: 'Artwork not found' } };
  // Save feedback if provided
  if (feedback && feedback.trim()) {
    const { createFeedback } = require('../models/feedback');
    await createFeedback({ artworkId: id, curatorId: user.id, comments: feedback, rating: null });
  }
  // Fetch artist email
  const artist = await findUserById(artwork.submitted_by);
  const { sendArtworkStatusEmail } = require('../utils/email');
  await sendArtworkStatusEmail(artist?.email, artwork, 'approved', feedback);
  return { status: 200, data: artwork };
}
async function rejectArtwork(id, user, feedback) {
  if (!user || user.role !== 'curator') return { status: 403, data: { message: 'Only curators can reject artwork' } };
  const artwork = await rejectArtworkById(id, user.id);
  if (!artwork) return { status: 404, data: { message: 'Artwork not found' } };
  // Save feedback if provided
  if (feedback && feedback.trim()) {
    const { createFeedback } = require('../models/feedback');
    await createFeedback({ artworkId: id, curatorId: user.id, comments: feedback, rating: null });
  }
  // Fetch artist email
  const artist = await findUserById(artwork.submitted_by);
  const { sendArtworkStatusEmail } = require('../utils/email');
  await sendArtworkStatusEmail(artist?.email, artwork, 'rejected', feedback);
  return { status: 200, data: artwork };
}

module.exports = { createArtwork: createArtworkService, getArtwork, listArtworks, approveArtwork, rejectArtwork };
