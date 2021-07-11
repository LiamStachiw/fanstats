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

    nhlApi.Teams.getRosters("20202021").then(function(data) {
        data.forEach(team => {
            team.roster.forEach(player => {
                var playerStats;

                nhlApi.Players.getStats(player.person.id, {
                    "displayName": "yearByYear",
                    "gameType": null
                    }).then(function(stats) {
                        try {
                            playerStats = stats[0].splits[0].stat;
                            playerStats.name = player.person.fullName;
                            playerStats.team = player.person.currentTeam.name;
                        } catch (error) {
                            console.log(`Caught by try/catch ${error}`);
                        }                 
                    });

                players.push.playerStats;
            });
        });

        console.log(players);

        // nhlApi.Players.getStats(playerIDs[1], {
        //     "displayName": "yearByYear",
        //     "gameType": null
        //     }).then(function(data){
        //         console.log(data[0].splits[0].stat);
        //     });

    });

    var obj = { "first": "test", "second": "object"}

    res.render('index', { title: 'Home', json: obj});
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