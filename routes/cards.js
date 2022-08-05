const routesCards = require("express").Router();
const {
  getCards,
  createCard,
  deleteCard,
  addlikeToCard,
  deleteLikeFromCard,
} = require("../controllers/cards");

routesCards.get("/cards", getCards);

routesCards.post("/cards", createCard);

routesCards.delete("/cards/:cardId", deleteCard);

routesCards.put("/cards/:cardId/likes", addlikeToCard);

routesCards.delete("/cards/:cardId/likes", deleteLikeFromCard);

module.exports = routesCards;
