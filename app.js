// index.js

/**
 * Required External Modules
 */
const express = require('express');
const path = require('path');

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || '3000';

/**
 *  App Configuration
 */
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/**
 * Routes Definitions
 */
app.get('/', function(req, res) {
    res.render('index', { title: 'Home'});
})

app.get('/user', function(req, res) {
    res.render('user', { title: 'Profile', userProfile: { nickname: 'Auth0' } });
});


// 404 Page
app.use(function (req, res, next) {
    res.status(404).send("Page not found");
})

/**
 * Server Activation
 */
app.listen(port, function() {
    console.log(`Listening to requests on ${port}`)
})