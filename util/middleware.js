const jwt = require('jsonwebtoken');

const { Blog } = require('../models');
const { SECRET } = require('./config');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: 'token invalid'});
    }
  } else {
    return res.status(401).json({ error: 'token missing'});
  }
  next();
};

module.exports = {
  blogFinder, tokenExtractor
};