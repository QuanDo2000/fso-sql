const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');
const Session = require('../models/session');

const errorHandler = (error, request, response, next) => {
  console.error(JSON.stringify(error));

  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  const token = authorization.substring(7);
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(token, SECRET);
    } catch (err) {
      console.log(err);
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  Session.findOne({
    where: {
      userId: req.decodedToken.id,
    },
  })
    .then((session) => {
      if (
        !session ||
        session.token !== token ||
        session.token === null ||
        new Date(session.updatedAt).getTime() + 1000 * 60 * 60 * 24 <
          new Date().getTime()
      ) {
        return res.status(401).json({ error: 'token invalid' });
      }
      next();
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({ error: 'token invalid' });
    });
};

module.exports = {
  errorHandler,
  tokenExtractor,
};
