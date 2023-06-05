const router = require('express').Router();

const Session = require('../models/session');
const { tokenExtractor } = require('../util/middleware');

router.delete('/', tokenExtractor, async (request, response) => {
  const { decodedToken } = request;

  await Session.destroy({
    where: {
      token: decodedToken.token,
    },
  });

  response.status(204).end();
});

module.exports = router;
