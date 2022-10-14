require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const err = require('./middlewares/err');
const { allowedCors, DEFAULT_ALLOWED_METHODS, DEFAULT_ALLOWED_HEADERS } = require('./constants/cors');

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

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
  return null;
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

// Роутинг (вынесен отдельно)
app.use(routes);

// Подключение логирования ошибок
app.use(errorLogger);

// Обработчик ошибок celebrate
app.use(errors());

// Централизованная обработка ошибок
app.use(err);

// Слушаем порт
app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${BASE_PATH}`);
  console.log(`Слушаем порт ${PORT}`);
});
