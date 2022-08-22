const express = require('express');
var session   = require('express-session');

const {MongoClient} = require('mongodb');
const fs = require('fs');
require('dotenv').config();

const databaseURI = `mongodb+srv://cBender01:${process.env.PASS}@vatacluster.hf97q3f.mongodb.net/?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(databaseURI);
const PORT = process.env.PORT || 3000;

const app = express();
app.use(session({
    secret: 'VataCluster',
    saveUninitialized: true,
    resave: false,
    cookie: { secure: false }
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/** setup mongo client helper functions */
mongoClient.createUser = (async (username, email, password) => {
    var vataDB = mongoClient.db('Vata');
    var vataUsers = vataDB.collection('Users');

    var newUser = {
        username: username,
        email: email,
        password: password
    };

    var res = await vataUsers.insertOne(newUser);
    return res.insertedId;
});

mongoClient.fetchUser = (async (_username) => {
    var vataDB = mongoClient.db('Vata');
    var vataUsers = vataDB.collection('Users');

    var eQuery = { email: _username };
    var nQuery = { username: _username };
    var options = { projection: {_id: 0, username: 1, email: 1, password: 1} };

    var eURes = await vataUsers.findOne(nQuery, options);
    var nURes = await vataUsers.findOne(eQuery, options);

    return nURes || eURes;
});
/** ================================================================= */

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/', async (req, res) => {
    // if(req.session.loggedIn) {
    //     // give diff page
    //     return;
    // }

    let f = fs.readFileSync('./public/index.html', 'utf8');
    let loginTitle = "Login";
    if(req.session.loggedIn) loginTitle = req.session.user.name;

    f = f.replace(/\{\{loginTitle\}\}/gm, loginTitle)
    res.status(200).send(f);
});

app.use(express.static('public'));

app.post('/api/login', async (req, res) => {
    let params = req.body;
    if(!params.username || !params.password) return res.status(403).send({ error: "Invalid username or password." });

    // check if username is valid, if so check password hash (or wahtever)
    var userRes = await getUser(params.username);
    if(userRes == null) {
        return res.status(403).json({message: "Invalid username or password. b" });
    }

    if(params.password != userRes.password) return res.status(403).json({message: "Invalid username or password." });

    req.session.loggedIn = true;
    req.session.user = {
        name: userRes.username,
        email: userRes.email,
        pass: userRes.password
    };

    res.status(200).send({message: "Logged in successfully."});
});

app.post('/api/signup', async (req, res) => {
    let params = req.body;
    
    var infoCheckUser = await getUser(params.username);
    var infoCheckEmail = await getUser(params.email);
    
    //username or email are already taken
    if(infoCheckUser != null || infoCheckEmail != null){
        return res.status(403).send({ error: 'This user already exists' });
    }

    if(!params.username || !params.email || !params.password){
        res.status(403).send({error: 'Missing username, email or password'});
    }

    var parsedEmail = params.email.replace(/\+[\d]*/g, '');
    var emailUser = parsedEmail.split('@')[0].replace(/\./g, '');
    var domain = parsedEmail.split('@')[1];
    parsedEmail = `${emailUser}@${domain}`;
    
    req.session.loggedIn = true;
    req.session.user = {
        name: params.username,
        email: parsedEmail,
        pass: params.password
    };

    //If all is good, create new user
    writeUser(params.username, parsedEmail, params.password);
    
    res.status(200).redirect('/');
});

app.listen(PORT, () => {
    /// color the port number in green
    console.log(`Server listening on port ${PORT}`);
    getUser('connorbender@gmail.com');
});

function writeUser(username, email, password) {
    mongoClient.createUser(username, email, password);
}

async function getUser(username){
    var info = await mongoClient.fetchUser(username);
    return info;
}
