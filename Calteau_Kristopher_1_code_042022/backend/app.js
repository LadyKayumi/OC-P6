// Appel des modules 
const express = require('express');
const mongoose = require('mongoose');
const path = require("path");

// Appel des routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Appel d'express
const app = express();

// Connection à la BDD MongoDB
mongoose.connect('mongodb+srv://Kayumi:Kayumi95150@piiquante.j4zwj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Express sous JSON pour lecture
app.use(express.json());

// Images mise dans /images grâce à express avec des noms spécifiques
app.use("/images", express.static(path.join(__dirname, "images")));

// Utilisation des routes avec l'API
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

// Exportation d'express sous "app" pour utilisation dans le backend
module.exports = app;