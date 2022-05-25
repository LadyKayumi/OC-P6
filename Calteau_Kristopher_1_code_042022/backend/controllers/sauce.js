// Appel du modèle Sauce et des modules nécessaire
const Sauce = require("../models/sauce");
const fs = require("fs");
const { error } = require("console");

// Création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
}

// Modification des sauces créées
exports.modifySauces = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "objet modifié" }))
        .catch(error => res.status(400).json({ error }));
}

// Suppression des sauces 
exports.deleteSauces = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "objet supprimé" }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(400).json({ error }));
}

// Obtention d'une sauce précise
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

// Obtention de toute les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}

// Gestion des likes/dislikes
exports.likeDislike = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            let usersLiked = sauce.usersLiked;
            let usersDisliked = sauce.usersDisliked;
            let likes = sauce.likes;
            let dislikes = sauce.dislikes;
            let userId = sauce.userId;
            if (req.body.like == -1) {
                usersLiked = usersLiked.filter(userId => userId != req.body.userId),
                    usersDisliked.push(req.body.userId),
                    dislikes++;
            } else if (req.body.like == 1) {
                usersLiked = usersLiked.filter(userId => userId != req.body.userId),
                    usersLiked.push(req.body.userId),
                    likes++
            } else if (req.body.like == 0) {
                if (usersLiked.includes(userId)) {
                    usersLiked = usersLiked.filter(userId => userId != req.body.userId),
                        likes--;
                }
                if (usersDisliked.includes(userId)) {
                    usersDisliked = usersDisliked.filter(userId => userId != req.body.userId),
                        dislikes--;
                }
            };
            const data = {
                likes: likes,
                dislikes: dislikes,
                usersLiked: usersLiked,
                usersDisliked: usersDisliked,
            }
            Sauce.updateOne({ _id: req.params.id }, data)
                .then(() => {
                    res.status(200).json({ message: "Likes mis à jour!" });
                }).catch(error => {
                    res.status(400).json(error);
                    console.error(error);
                });
        });
}