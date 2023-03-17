const Model = require("mongoose");
const ModelSauce = require("../models/sauces");
const fs = require("fs");

/* Create Sauce */

exports.CreateSauce = (req, res, next) => {
  const SauceObj = JSON.parse(req.body.sauce);
  delete SauceObj._id;
  const newsauce = new ModelSauce({
    ...SauceObj,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  newsauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce created !" }))
    .catch((error) => res.status(400).json({ error }));
};

/* Get all sauce */

exports.GetAllSauce = (req, res, next) => {
  ModelSauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

/* Get one sauce */

exports.GetOneSauce = (req, res, next) => {
  ModelSauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

/* Update sauce */

exports.UpdateSauce = (req, res, next) => {
  ModelSauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId === req.auth.userId) {
        if (req.file) {
          const image = sauce.imageUrl.split("/images/")[1];
          fs.unlink("images/" + image, () => {
            console.log("L'image a bien été supprimée");
          });
        }
        const newdatasauce = req.file
          ? {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`,
            }
          : { ...req.body };
        ModelSauce.updateOne({ _id: req.params.id }, { ...newdatasauce })
          .then(() => res.status(200).json({ message: "Sauce updated !" }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        res
          .status(401)
          .json({ message: "Vous n'avez pas accès à la modification" });
      }
    })
    .catch((error) => res.status(404).json({ error }));
};

/* Delete Sauce */

exports.DeleteSauce = (req, res, next) => {
  ModelSauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId === req.auth.userId) {
        const image = sauce.imageUrl.split("/images/")[1];
        fs.unlink("images/" + image, () => {
          console.log("L'image a bien été supprimée");
          ModelSauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce deleted !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      } else {
        res
          .status(401)
          .json({ message: "Vous n'avez pas accès à la suppression" });
      }
    })
    .catch(() => console.log("Erreur de la suppression de l'ancienne image"));
};

/* Likes/Dislikes */

exports.AddLikeOrDislike = (req, res, next) => {
  ModelSauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (req.body.like === 1 && !sauce.usersLiked.includes(req.body.userId)) {
        ModelSauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "+1 Like" }))
          .catch((error) => res.status(400).json({ error }));
      }
      if (req.body.like === -1 && !sauce.usersLiked.includes(req.body.userId)) {
        ModelSauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "+1 Dislike" }))
          .catch((error) => res.status(400).json({ error }));
      }
      if (req.body.like === 0) {
        if (sauce.usersLiked.includes(req.body.userId)) {
          ModelSauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId },
            }
          )
            .then(() => res.status(201).json({ message: "Remove Like" }))
            .catch((error) => res.status(400).json({ error }));
        }
        if (sauce.usersDisliked.includes(req.body.userId)) {
          ModelSauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
            }
          )
            .then(() => res.status(201).json({ message: "Remove Dislike" }))
            .catch((error) => res.status(400).json({ error }));
        }
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
