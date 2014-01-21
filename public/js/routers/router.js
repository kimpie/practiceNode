var app = app || {};

(function () {
        'use strict';


        var AppRouter = Backbone.Router.extend({
                routes: {
                        'players/:player': 'playerDetails'
                },

                initialize: function () {
                        console.log('Router is initialized');
                        this.collection = new app.Players();
                        this.collection.fetch({reset: true});

                        this.playerModel = new app.playerModel();
                        this.playerView = new app.PlayersView({model: this.playerModel});   

                },

                playerDetails: function (player) {
                        this.playerView.model = this.collection.get(player);
                        console.log('Router has been triggered with ' + player);
                        $('#userName').html(this.playerView.render().el);
                }

        });

        app.AppRouter = new AppRouter();

        Backbone.history.start();
})();