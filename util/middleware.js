const jwt = require('jsonwebtoken');

const { Blog, Session } = require('../models');
const { SECRET } = require('./config');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7);
      req.decodedToken = jwt.verify(token, SECRET, err => {
        return res.status(401).json({ error: err.message });
      });
      const sessionToken = await Session.findOne({
        where: {
          token
        }
      });
      if (sessionToken.disabled) {
        return res.status(401).json({ error: 'user is disabled'});
      }
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