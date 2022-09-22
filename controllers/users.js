const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const BadRequestError = require("../utils/errors/bad_request");
const UnauthorizedError = require("../utils/errors/unauthorized");
const NotFoundError = require("../utils/errors/not_found");
const ConflictError = require("../utils/errors/conflict");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => {
      next(new NotFoundError("Пользователь не найден"));
    })
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Введен невалидный id"));
      } else if (err.message === "NotFound") {
        next(new NotFoundError("Пользователь по указанному _id не найден."));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) =>
      res.status(200).send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError("Почта уже существует"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true, upsert: false }
  )
    .orFail(() => {
      throw new Error("NotFound");
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else if (err.message === "NotFound") {
        next(new NotFoundError("Пользователь по указанному _id не найден."));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true, upsert: false }
  )
    .orFail(() => {
      throw new Error("NotFound");
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else if (err.message === "NotFound") {
        next(new NotFoundError("Пользователь по указанному _id не найден."));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });
      res
        .cookie("jwt", token, {
          maxage: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: "Авторизация успешна" });
    })
    .catch(() => {
      next(new UnauthorizedError("Почта или пароль введены неправильно"));
    });
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findOne({_id: userId})
    .then((user)=>{
      if(user){
        res.send({ data:user });
      } else {
        next(new NotFoundError("Пользователь по указанному _id не найден."));
      }
    })
    .catch((err)=>{
      if (err.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные"));
      } else {
        next(err);
      }
    });
};
