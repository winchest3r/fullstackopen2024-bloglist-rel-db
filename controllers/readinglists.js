const router = require('express').Router();

const { ReadingList } = require('../models');

const { tokenExtractor } = require('../util/middleware');

router.post('/', tokenExtractor, async (req, res) => {
  const reading = await ReadingList.create(req.body);
  res.json(reading);
});

router.put('/:id', tokenExtractor, async (req, res) => {
  const reading = await ReadingList.findByPk(req.params.id);
  if (reading) {
    reading.read = req.body.read;
    await reading.save();
    res.json(reading);
  } else {
    res.status(404).end();
  }
});

module.exports = router;