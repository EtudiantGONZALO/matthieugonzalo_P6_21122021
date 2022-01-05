//import de multer
const multer = require('multer');

//on accepte 3 formats d'images
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  //la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    //la fonction filename indique à multer d'utiliser le nom d'origine
    //remplacer les espaces par des underscores
    //ajouter un timestamp Date.now() comme nom de fichier
    //MIME pour résoudre l'extension de fichier appropriée
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

//Nous exportons ensuite l'élément multer entièrement configuré, 
//lui passons notre constante storage 
//et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image
module.exports = multer({storage: storage}).single('image');