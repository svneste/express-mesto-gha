const jwt = require('jsonwebtoken');
const {
  UNAUTHORIZED,
} = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res
      .status(UNAUTHORIZED)
      .send({ message: 'Необходима авторизация ' });
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, 'some-secret-key');
    } catch (err) {
      res
        .status(UNAUTHORIZED)
        .send({ message: 'Необходима авторизация ' });
    }
    req.user = payload;
    next();
  }
};
