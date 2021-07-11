// index.js

/**
 * Required External Modules
 */
const nhlApi = require("statsapi-nhl");
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
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/**
 * Routes Definitions
 */
app.get('/', function(req, res) {

    var players = [];
    var promises = [];

    nhlApi.Teams.getRosters("20202021").then(function(data) {
        data.forEach(team => {
            team.roster.forEach(player => {
                var playerStats;

                promises.push(nhlApi.Players.getStats(player.person.id, {
                    "displayName": "yearByYear",
                    "gameType": null
                    }).then(function(stats) {
                        if(typeof(stats[0].splits[0]) !== 'undefined'){
                            playerStats = stats[0].splits[0].stat;
                            playerStats.name = player.person.fullName;
                            playerStats.team = player.person.currentTeam.name;
                            playerStats.position = player.person.primaryPosition.abbreviation;
                            players.push(playerStats);
                        }
                    }).catch(err => console.log("Error:", err))
                );    
            });
        });

        Promise.allSettled(promises).then(function() {

            res.render('index', { title: 'Home', players: players});

        });

    }).catch(err => console.log("Error:", err));
})

// 404 Page
app.use(function (req, res, next) {
    res.render('404', { title: '404 - Page Not Found'});
})

/**
 * Server Activation
 */
app.listen(port, function() {
    console.log(`Listening to requests on port ${port}`)
})