//import du modèle
const Sauces = require('../models/Sauces');
//permet de supprimer l'image
const fs = require('fs');

//permet d'ajouter une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauces({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      // initialise like et dislikes à 0
      likes : 0, 
      dislikes : 0,
      // initialise les tableaux 
      usersLiked : [],
      usersDisliked : [],
    });
    sauce.save()
      .then(() => res.status(201).json({message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({error}));
};

//permet de modifier une sauce que l'on a crée
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauces.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
      .then(() => res.status(200).json({message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({error}));
};

//permet de supprimer une sauce que l'on a crée
exports.deleteSauce = (req, res, next) => {
    Sauces.findOne({_id: req.params.id})
        .then((sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauces.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({error}));
            });
            if (!sauce) {
                return res.status(404).json({
                    error: new Error('Objet non trouvé !')
                });
            }
            if (sauce.userId !== req.auth.userId) {
                return res.status(401).json({
                    error: new Error('Requete non autoriséé !')
                });
            }
        })
        .catch(error => res.status(500).json({ error }));   
};

//permet a tous les utilisateurs d'avoir le descriptif de la sauce
exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({_id: req.params.id})
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({error}));
};

//permet a tous les utilisateurs de voir toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauces.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({error}));
};

//permet aux utilisateurs d'utiliser le mode Like
exports.likeStatus = async (req, res, next) => {

    const likeValue = req.body.like; 
    const userID = req.body.userId;
    const SauceID = req.params.id; 
    
    try {
      const sauce = await Sauces.findOne({ _id : SauceID }) // juste un bug sur le compteur 
      switch (likeValue) {
        
        // Like
        case 1: 
          if (!sauce.usersLiked.includes(userID) ) {
            await Sauces.updateOne(
              { _id: SauceID }, 
              { $push: { usersLiked : userID }, $inc: { likes : 1 } }
            )
            res.status(200).json( {message : "Like !"}); 
            break;
          }
        
          // Dislike
          case -1: 
          if (!sauce.usersDisliked.includes(userID) ) {
            await Sauces.updateOne(
              { _id: SauceID }, 
              {$push: { usersDisliked : userID }, $inc: { dislikes : 1 } }
            )
            res.status(200).json( {message : "Dislike !"});
            break;
          }
    
          // Cancel Like
          case 0: 
          if (sauce.usersLiked.includes(userID) ) {
            await Sauces.updateOne(
              { _id: SauceID }, 
              {$pull: { usersLiked : userID }, $inc: { likes : -1 } }
            )
            res.status(200).json( {message : "Cancel Like !"}); 
            break;
          }
    
          // Cancel Dislike 
          case 0: 
          if (sauce.usersDisliked.includes(userID) ) {
             await Sauces.updateOne(
              { _id: SauceID }, 
              {$pull: { usersDisliked : userID }, $inc: { dislikes : -1 } }
            )
            res.status(200).json( {message : "Cancel Dislike !"}); 
            break;
          }
          default : 
          res.status(400).json( {error : "Une erreur est arrivée !"});
    
      } // fin switch 
    } // fin function - try
    
    catch (error) { res.status(400).json( { error } );}
    
    }