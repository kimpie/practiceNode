var app = app || {};

(function () {
        'use strict';


        var AppRouter = Backbone.Router.extend({
                routes: {
                        "": "index",
                        "players/:id": "playerOn",
                        "players/:id/games/:game": "inGame"
                },

                initialize: function () {
                    console.log('Router is initialized.');
                },

                playerOn: function (id) {
                    this.trigger('playerOn', id);
                    console.log('Router on player page: ' + id);
                },

                inGame: function(id, game){
                    var gameid = game;
                    console.log('ROUTER on inGame page: ' + gameid);
                    this.trigger('inGame', gameid);
                }

        });

        app.AppRouter = new AppRouter();

        Backbone.history.start();
})();