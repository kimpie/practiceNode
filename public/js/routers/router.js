var app = app || {};

(function () {
        'use strict';


        var AppRouter = Backbone.Router.extend({
                routes: {
                        '/': 'login'
                },

                login: function (param) {
                        // Set the current filter to be used
                        app.TodoFilter = param || '';

                        // Trigger a collection filter event, causing hiding/unhiding
                        // of Todo view items
                        app.todos.trigger('filter');
                }
        });

        app.AppRouter = new AppRouter();
        Backbone.history.start();
})();