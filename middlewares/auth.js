const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../utils/errors/unauthorized');

module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError ('Необходима авторизация'));

  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    next(new UnauthorizedError ('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};