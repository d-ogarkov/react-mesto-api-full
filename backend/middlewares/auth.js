const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth');
const { NODE_ENV, JWT_SECRET, JWT_DEV } = process.env;
const { MESSAGE_TYPE } = require('../constants/errors');

// Middleware для авторизации
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError(MESSAGE_TYPE.unauthorized);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  // Верифицируем переданный токен
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV,
    );
  } catch (err) {
    throw new AuthError(MESSAGE_TYPE.unauthorized);
  }

  // Добавляем payload в запрос и передаем следующему обработчику
  req.user = payload;
  next();
};
