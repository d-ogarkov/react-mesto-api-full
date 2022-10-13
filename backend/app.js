require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/not-found');
const { MESSAGE_TYPE } = require('./constants/errors');
const { REGEX_PATTERN } = require('./constants/patterns');
const { allowedCors, DEFAULT_ALLOWED_METHODS, DEFAULT_ALLOWED_HEADERS } = require('./constants/cors');

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

console.log(process.env);

// Подключаемся к серверу MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb', {
  autoIndex: true, // Без этого не будет работать unique: true в userSchema.email
});

// Поддержка CORS
app.use((req, res, next) => {
  const { method } = req; // Сохраняем тип запроса (HTTP-метод)
  const { origin } = req.headers; // Сохраняем источник запроса
  // Проверяем, есть ли источник запроса среди разрешенных
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', '*');
  }
  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // Разрешаем кросс-доменные запросы перечисленных типов
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', DEFAULT_ALLOWED_HEADERS);
    return res.end();
  }
  next();
});

// Для разбора JSON
app.use(bodyParser.json());

// Для обработки кук, т.к. токен отдаем в куки
app.use(cookieParser());

// Подключение логирования запросов на сервер
app.use(requestLogger);

// Для краш-теста сервера (pm2 должен поднять упавший сервер)
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Эти роуты не требуют авторизации
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(REGEX_PATTERN.email),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(REGEX_PATTERN.url),
    email: Joi.string().required().pattern(REGEX_PATTERN.email),
    password: Joi.string().required(),
  }),
}), createUser);

// Авторизация
app.use(auth);

// Все роуты ниже требуют авторизации
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// После всех роутов ловим неправильные пути
app.use(() => {
  throw new NotFoundError(MESSAGE_TYPE.noPath);
});

// Подключение логирования ошибок
app.use(errorLogger);

// Обработчик ошибок celebrate
app.use(errors());

// Централизованная обработка ошибок
app.use((err, req, res, next) => {
  // Если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // Проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? MESSAGE_TYPE.default
        : message,
    });

  next();
});

// Слушаем порт
app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${BASE_PATH}`);
  console.log(`Слушаем порт ${PORT}`);
});
