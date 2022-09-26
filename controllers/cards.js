const Card = require('../models/card');

const BadRequestError = require('../utils/errors/bad_request');
const NotFoundError = require('../utils/errors/not_found');
const ForbiddenError = require('../utils/errors/forbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((result) => res.send(result))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
  .then((card) => {
    if(!card) {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    }
    if (!card.owner.equals(req.user._id)){
      throw new ForbiddenError('Отстутствуют права на удаление чужой карточки')
    }

    return Card.findByIdAndRemove(req.params.cardId)
    .then((result) => {
    res.send(result);
    })
    .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Невалидный id'));
    }

    return  next(err);
  });
});
};

module.exports.addlikeToCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий _id карточки');
    })
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteLikeFromCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Передан несуществующий _id карточки'));
      } else {
        next(err);
      }
    });
};
