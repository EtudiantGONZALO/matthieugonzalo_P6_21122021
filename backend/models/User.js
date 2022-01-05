//import des logiciel npm
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//schéma d'une identité
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

//exportation du schéma
module.exports = mongoose.model('User', userSchema);