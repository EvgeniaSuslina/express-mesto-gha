const User = require('../models/user');
const {
  SUCСESSFUL,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
} = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((users) => res.status(SUCСESSFUL).send(users))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((users) => res.status(SUCСESSFUL).send(users))
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

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true, upsert: false }
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((users) => res.status(SUCСESSFUL).send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные'});
      } else if (err.name === 'NotFound') {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true, upsert: false }
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((users) => res.status(SUCСESSFUL).send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'NotFound') {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};
