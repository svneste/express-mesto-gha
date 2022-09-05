const Card = require('../models/card');
const {
  STATUS_OK,
  BAD_REQUEST,
  ERROR_ID,
  ERROR_SERVER,
} = require('../utils/constants');

const findCards = (req, res) => {
  Card.find({})
    .then((users) => res.status(STATUS_OK).send(users))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Сервер не может обработать запрос' }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.status(STATUS_OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Сервер не может обработать запрос' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(STATUS_OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_ID).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Сервер не может обработать запрос' });
      }
    });
};

const addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(STATUS_OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_ID).send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Сервер не может обработать запрос' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(STATUS_OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_ID).send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Сервер не может обработать запрос' });
      }
    });
};

module.exports = {
  findCards,
  createCard,
  deleteCard,
  addLike,
  dislikeCard,
};
