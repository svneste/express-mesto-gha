const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { STATUS_OK, BAD_REQUEST } = require('../utils/constants');

const NotFoundError = require('../errors/not-found-err');
const BadRequetError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequetError('Переданы некорректные данные при создании пользователя'));
        } else {
          next(err);
        }
      }));
};

const findUser = (req, res, next) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      } else res.status(STATUS_OK).send(user._id);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequetError('Передан некорректный _id пользователя'));
      } else {
        next(err);
      }
    });
};

const refreshProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequetError('Неверные данные'));
      } else {
        next(err);
      }
    });
};

const refreshAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequetError('Неверные данные'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(STATUS_OK).send(user);
    })
    .catch(next);
};

module.exports = {
  createUser,
  findUser,
  getUser,
  refreshProfile,
  refreshAvatar,
  login,
  getUserInfo,
};
