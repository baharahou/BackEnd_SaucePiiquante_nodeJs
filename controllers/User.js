const ModelUser = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PasswordValidator = require("password-validator");
const validator = require("email-validator");

/* Model Password */

let PasswordSchema = new PasswordValidator();
PasswordSchema.is()
  .min(8)
  .is()
  .max(20)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(["Azertyuiop1", "qsdfghjklm1"]);

/* Controller Signup */

exports.signup = (req, res, next) => {
    if (!PasswordSchema.validate(req.body.password)) {
        return res.status(400).json(new Error("Le mot de passe est invalide et doit contenir au moins 8 caractères dont 1 majuscule, 1 minuscule et 1 chiffre, sans espace et ne doit pas dépasser les 20 caractères"))
    } else if (!validator.validate(req.body.email)) {
      return res.status(400).json(new Error("L'adresse mail est invalide"))
    } else {
        bcrypt
          .hash(req.body.password, parseInt(process.env.CRYPT))
          .then((hash) => {
            const User = new ModelUser({
              email: req.body.email,
              password: hash,
            });
            User.save()
              .then(() => res.status(201).json({ message: "User created !" }))
              .catch((error) => res.status(400).json({ error }));
          })
          .catch((error) => res.status(500).json({ error }));
    }
};

/* Controller Login */

exports.login = (req, res, next) => {
  ModelUser.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.Token, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
