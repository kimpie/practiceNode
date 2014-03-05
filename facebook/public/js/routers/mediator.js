var mediator = {};

_.extend(mediator, Backbone.Events);

mediator.on("yourturn", function() {
  	var e = jQuery.Event("click");
    $("#turn").trigger(e);
});

