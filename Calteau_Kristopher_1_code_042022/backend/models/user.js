// Appel des modules
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Schéma du modèle pour les utilisateurs
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Validateur supplémentaire pour s'assurer que l'utilisateur soit unique
userSchema.plugin(uniqueValidator);

// Exportation du schéma pour utilisation dans le backend
module.exports = mongoose.model("User", userSchema);