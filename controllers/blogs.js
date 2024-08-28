const router = require('express').Router();
const { Op } = require('sequelize');

const { Blog } = require('../models');
const { User } = require('../models');
const { blogFinder, tokenExtractor } = require('../util/middleware');

router.get('/', async (req, res) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: {
        title: {
          [Op.substring]: req.query.search
        },
        author: {
          [Op.substring]: req.query.search
        }
      }
    }
  }

  const blogs = await Blog.findAll({
    attributes: {
      exclude: ['userId']
    },
    include: {
      model: User,
      attributes: {
        exclude: [
          'passwordHash',
          'userId'
        ]
      }
    },
    where,
    order: [
      ['likes', 'DESC']
    ]
  });

  res.json(blogs);
});

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({ ...req.body, userId: user.id });
  res.json(blog);
});

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).end();
  }
});

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  if (req.blog && req.blog.userId === req.decodedToken.id) {
    await req.blog.destroy();
  }
  res.status(204).end();
});

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json({ likes: req.blog.likes });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
