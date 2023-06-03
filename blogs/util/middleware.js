const errorHandler = (error, request, response, next) => {
  console.error(JSON.stringify(error));

  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  errorHandler,
};
