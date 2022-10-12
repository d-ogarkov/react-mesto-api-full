const allowedCors = [
  'https://ogarkov.mesto.nomoredomains.icu',
  'http://localhost:3000',
  'localhost:3000',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const DEFAULT_ALLOWED_HEADERS = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';

module.exports = {
  allowedCors, DEFAULT_ALLOWED_METHODS, DEFAULT_ALLOWED_HEADERS,
};
