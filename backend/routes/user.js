//crétion du router
const express = require('express');
const router = express.Router();

//import du controllers
const userCtrl = require('../controllers/user');

//routes vers /api/auth/
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//export du router
module.exports = router;