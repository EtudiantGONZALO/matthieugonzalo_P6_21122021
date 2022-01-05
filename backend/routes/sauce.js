//crétion du router
const express = require('express');
const router = express.Router();

//import controllers
const sauceCtrl = require('../controllers/sauce');
//import middleware
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//Routes vers /api/sauces/
router.get('/', auth, sauceCtrl.getAllSauces);

router.post('/', auth, multer, sauceCtrl.createSauce);

router.get('/:id', auth, sauceCtrl.getOneSauce);

router.put('/:id', auth, multer, sauceCtrl.modifySauce);

router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.post('/:id/like', auth, sauceCtrl.likeStatus);

//export du router
module.exports = router;