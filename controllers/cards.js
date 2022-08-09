const Card = require('../models/card');
const {
  SUCСESSFUL,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(SUCСESSFUL).send(cards))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(SUCСESSFUL).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((cards) => res.status(SUCСESSFUL).send(cards))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Невалидный id' });
      } else if (err.message === 'NotFound') {
        res
          .status(NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.addlikeToCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((cards) => res.status(SUCСESSFUL).send(cards))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Передан некорректный id' });
      } else if (err.message === 'NotFound') {
        res
          .status(NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.deleteLikeFromCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((cards) => res.status(SUCСESSFUL).send(cards))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Передан некорректный id' });
      } else if (err.message === 'NotFound') {
        res
          .status(NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};
