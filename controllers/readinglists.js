const router = require('express').Router();

const { ReadingList } = require('../models');

const { tokenExtractor } = require('../util/middleware');

router.post('/', tokenExtractor, async (req, res) => {
  const readingItem = await ReadingList.create(req.body);
  res.json(readingItem);
});

module.exports = router;