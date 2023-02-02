const allowedCors = [
  'https://mesto.ogarkov.com',
  'http://mesto.ogarkov.com',
  'http://localhost:3001',
  'localhost:3001',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const DEFAULT_ALLOWED_HEADERS = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';

module.exports = {
  allowedCors, DEFAULT_ALLOWED_METHODS, DEFAULT_ALLOWED_HEADERS,
};
