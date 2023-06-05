const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');

const errorHandler = (error, request, response, next) => {
  console.error(JSON.stringify(error));

  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (err) {
      console.log(err);
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

module.exports = {
  errorHandler,
  tokenExtractor,
};
