//import de la librarie npm
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    //on ne cible que le token sans bearer
    const token = req.headers.authorization.split(' ')[1];
    //on decode le token avec verify
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //on extrait l'id utilisateur du token
    const userId = decodedToken.userId;
    req.auth = { userId: userId };
    //si la demande contient un ID utilisateur, nous le comparons à celui extrait du token. S'ils sont différents, nous générons une erreur
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID non valable !';
    } else {
      //notre utilisateur est authentifié. Nous passons l'exécution à l'aide de la fonction next()
      next();
      }
  } catch (error) {
    res.status(401).json({ error: error | 'Requete non authentifiée !'});
  }
};