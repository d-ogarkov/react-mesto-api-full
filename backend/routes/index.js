const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/not-found');
const { MESSAGE_TYPE } = require('../constants/errors');
const { REGEX_PATTERN } = require('../constants/patterns');

// Эти роуты не требуют авторизации
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(REGEX_PATTERN.email),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(REGEX_PATTERN.url),
    email: Joi.string().required().pattern(REGEX_PATTERN.email),
    password: Joi.string().required(),
  }),
}), createUser);

// Авторизация
router.use(auth);

// Все роуты ниже требуют авторизации
router.use('/users', userRouter);
router.use('/cards', cardRouter);

// После всех роутов ловим неправильные пути
router.use(() => {
  throw new NotFoundError(MESSAGE_TYPE.noPath);
});

module.exports = router;
