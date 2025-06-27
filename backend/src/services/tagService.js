// Tag service: create, list
const { createTag, getAllTags } = require('../models/tag');

async function createTagService(data, user) {
  if (!user || user.role !== 'curator') return { status: 403, data: { message: 'Only curators can create tags' } };
  if (!data.name) return { status: 400, data: { message: 'Tag name required' } };
  const tag = await createTag(data.name);
  return { status: 201, data: tag };
}

async function listTagsService() {
  const tags = await getAllTags();
  return { status: 200, data: tags };
}

module.exports = { createTag: createTagService, listTags: listTagsService };
