var app = app || {};

(function () {
        'use strict';


        var AppRouter = Backbone.Router.extend({
                routes: {
                        "players/:id": "playerOn",
                        "players/:id/games" : "setup",
                        "players/:id/games/:game": "inGame",
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

                inGame: function(id, game){
                    var playerid = id;
                    var game = game;
                    console.log('ROUTER on inGame page: ' + game);
                    this.trigger('inGame', game);
                },

                contact: function(){
                    this.trigger('contact');
                }

        });

        app.AppRouter = new AppRouter();

        Backbone.history.start();
})();