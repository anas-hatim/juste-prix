const express = require('express');
const favicon = require('serve-favicon');
const session = require("cookie-session");


const app = express()

// défini le moteur de rendu
app.set('view engine', 'ejs');

// défine le dossier ou se trouve les vues
app.set('views',__dirname + "/views");

app.use(express.urlencoded({ extended: true }));

// pour déclarer un dossier public
app.use(express.static(__dirname + '/public'));

// Afficher le favicon
app.use(favicon(__dirname + '/public/favicon.ico'));

// ajoute la gestion de la session dans l'application (dans les cookies)
app.use(session({secret: 'secretpass'}));

// affiche la vue du formulaire
app.get('/', (req, res) => {
    res.render('form' ,{
});
});

// affiche la vue du game

// traite les données envoyées pas le formulaire en POST
app.post('/game/settings/add/', (req, res) => {
    //console.log(req.session.playerOne);
    //console.log(req.session.playerTwo);
    //console.log(req.session.objectName);
    //console.log(req.session.playerTwo);

    req.session.playerOne = req.body.playerOne;
    req.session.playerTwo = req.body.playerTwo;
    req.session.objectName = req.body.objectName;
    req.session.objectValue = req.body.objectValue;

    res.redirect('/game');
});
//recuperer des nom des jeur ( page de jeux )
app.get('/game', (req, res) => {
    req.session.tentative = 0;
    res.render('game', {
        playerTwo: req.session.playerTwo,
        objectName: req.session.objectName,
        more : false,
        less : false,
        equal : false
    });
});

//analyse des donnés envoyer par la page game 
app.post('/game/check', (req, res) => { 
    req.session.tentative += 1;
    req.session.newTry = req.body.newTry;
    const newTry = Number(req.session.newTry);
    const objectValue = req.session.objectValue;
    let more = false;
    let less = false;
    let equal = false;

    if (newTry > objectValue)
    {less = true;}

    if (newTry < objectValue)
        {more = true;}
    
    if (newTry == objectValue)
        {equal = true;}
    
        res.render('game', {
            playerTwo: req.session.playerTwo,
            objectName: req.session.objectName,
            more : more,
            less : less,
            equal : equal,
            tentative: req.session.tentative
        });
})



// Cas par défaut si les autres urls n'ont pas matché
app.use((req, res) => {
    res.status(404);    
    res.send("Page introuvable");
});

// démarre le serveur sur le port 8090
app.listen(8090, () => {
    console.log("Le serveur est démarré sur le port 8090")
});