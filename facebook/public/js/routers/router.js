var app = app || {};

(function () {
        'use strict';


        var AppRouter = Backbone.Router.extend({
                routes: {
                        "": "index",
                        "/players/:id": "playerOn",
                        "/players/:id/games": "gameOn"
                },

                initialize: function () {
                    console.log('Router is initialized.');
                },

                appView: function(){
                    console.log('Router on appView');
                },

                index: function (){
                    console.log('Router on index page.');
                },

                playerOn: function (id) {
                    this.trigger('playerOn', id);
                    console.log('Router on player page: ' + id);
                },

                gameOn: function(){
                    console.log('Router on gameOn page.');
                }

        });

        app.AppRouter = new AppRouter();

        Backbone.history.start();
})();