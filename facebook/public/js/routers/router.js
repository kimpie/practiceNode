var app = app || {};

(function () {
        'use strict';


        var AppRouter = Backbone.Router.extend({
                routes: {
                        "players/:id": "playerOn",
                        "players/:id/games" : "setup",
                        "players/:id/games/:game": "gameBoard",
                        "players/:id/games/:game/*path" : "inGame",
                        "contact/" : "contact"
                },

                initialize: function () {
                    console.log('Router is initialized.');
                    //app.AppView.vent.on('getPage', this.sendPage, this);
                },

                playerOn: function (id) {
                    this.trigger('playerOn', id);
                    console.log('Router on player page: ' + id);
                },

                setup: function(id){
                    console.log('Router on setup page');
                },

                gameBoard: function(id, game){
                    var playerid = id;
                    var game = game;
                    console.log('ROUTER on inGame page: ' + game);
                    this.trigger('inGame', game);
                },

                inGame: function(id, game, path){
                    console.log('router has game id: ' + game + ' path ' + path);
                    var z = location.hash.length;
                    var a = z - 8;
                    var p = location.hash.substr(a,z);
                    var r = path.split('/')[1];
                    console.log(p + ' ' + r);
                    if(p == 'complete'){
                        app.AppView.vent.trigger('review', game, r);
                    }
                },

                contact: function(){
                    this.trigger('contact');
                }

        });

        app.AppRouter = new AppRouter();

        Backbone.history.start();
})();