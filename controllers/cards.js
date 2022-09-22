const Card = require("../models/card");

const BadRequestError = require("../utils/errors/bad_request");
const NotFoundError = require("../utils/errors/not_found");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      throw new Error("NotFound");
    })
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Невалидный id"));
      } else if (err.message === "NotFound") {
        next(new NotFoundError("Карточка с указанным _id не найдена."));
      } else {
        next(err);
      }
    });
};

module.exports.addlikeToCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail(() => {
      throw new Error("NotFound");
    })
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Передан некорректный id"));
      } else if (err.message === "NotFound") {
        next(new NotFoundError("Передан несуществующий _id карточки"));
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
      throw new Error("NotFound");
    })
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Передан некорректный id"));
      } else if (err.message === "NotFound") {
        next(new NotFoundError("Передан несуществующий _id карточки"));
      } else {
        next(err);
      }
    });
};
