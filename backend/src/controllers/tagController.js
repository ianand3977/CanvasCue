// Tag controller: create, list
const tagService = require('../services/tagService');

const createTag = async (req, res, next) => {
  try {
    const result = await tagService.createTag(req.body, req.user);
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};

const listTags = async (req, res, next) => {
  try {
    const result = await tagService.listTags();
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};

module.exports = { createTag, listTags };
