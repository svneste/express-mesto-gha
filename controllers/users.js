const User = require('../models/user');
const {
  STATUS_OK,
  BAD_REQUEST,
  ERROR_ID,
  ERROR_SERVER,
} = require('../utils/constants');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Сервер не может обработать запрос' });
      }
    });
};

const findUser = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send(users))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Сервер не может обработать запрос' }));
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_ID).send({ message: 'Такого пользователя не существует' });
      } else res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Сервер не может обработать запрос' });
      }
    });
};

const refreshProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true },
  )
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_ID).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Сервер не может обработать запрос' });
      }
    });
};

const refreshAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_ID).send({ message: 'Пользователь по указанному _id не найден' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Сервер не может обработать запрос' });
      }
    });
};

module.exports = {
  createUser,
  findUser,
  getUser,
  refreshProfile,
  refreshAvatar,
};
