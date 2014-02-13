var app = app || {};

(function () {
        'use strict';


        var AppRouter = Backbone.Router.extend({
                routes: {
                        '/facebook': 'index',
                        '/facebook/players/:player': 'playerOn',
                        '/facebook/players/:player/games': 'gameOn',
                        '/facebook/players/:player/games/:game': 'showGames'
                },

                initialize: function () {
                    console.log('Router is initialized');
                },

                index: function (){
                    alert('On Index Page.');
                    app.AppView.render().el;
                },

                playerOn: function (player) {
                    alert('On player page.');
                },

                gameOn: function(){
                    alert('On game page.');
                },

                showGames: function(game){
                    alert('On individual game page.');
                }

        });

        app.AppRouter = new AppRouter();
        Backbone.history.start({pushState: true});
})();