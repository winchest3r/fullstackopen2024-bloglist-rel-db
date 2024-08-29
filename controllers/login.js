const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { SECRET } = require('../util/config');
const { User, Session } = require('../models');

router.post('/', async (req, res) => {
  const body = req.body;

  const user = await User.findOne({
    where: {
      username: body.username
    }
  });

  if (!(user && bcrypt.compare(body.password, user.passwordHash))) {
    return res.status(401).json({
      error: 'invalid username or password'
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id
  };

  const token = jwt.sign(userForToken, SECRET);

  const sessionToken = await Session.findOne({
    where: {
      token
    }
  });

  if (!sessionToken) {
    await Session.create({
      token
    });
  } else {
    if (sessionToken.disabled) {
      return res.status(401).json({
        error: 'user is disabled'
      });
    }
  }

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = router;
