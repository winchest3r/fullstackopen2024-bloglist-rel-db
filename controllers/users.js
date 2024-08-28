const router = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Blog = require('../models/blog');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: {
      exclude: ['passwordHash']
    },
    include: {
      model: Blog,
      attributes: {
        exclude: ['userId']
      }
    }
  })
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: {
          exclute: ['userId']
        },
        through: {
          attributes: []
        }
      }
    ]
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  if (password.length < 4) {
    return res.status(400).json({
      error: 'password length less then 4'
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    username,
    name,
    passwordHash
  });

  res.json({ id: user.id, username, name });
});

router.put('/:username', async (req, res) => {
  const { username, name, password } = req.body;

  if (!username || !name || !password) {
    return res.status(400).json({
      error: 'bad request'
    });
  }

  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  });

  if (user === null) {
    return res.status(404).json({
      error: 'no user with selected username'
    });
  }

  const match = await bcrypt.compare(password, user.passwordHash);

  if (!match) {
    return res.status(401).json({
      error: 'unauthorized for username change'
    });
  }

  user.username = username;
  await user.save();
  res.json({
    id: user.id,
    username: user.username,
    name: user.name
  });
});

module.exports = router;