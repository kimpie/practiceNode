var Room = require('schemas/rooms.js');

exports.create = function (req, res) {
	var randomNum = //create this
	var players = [{
            id: id,
            name: req.body.name,
            status: 'joined',
            statusDate: Date.now()
         }];
    
   // Create placeholders for the other players to join
   // the game.
   for ( var i=1;i<num;i++ ) {
 
      players.push({
         id: id+'-'+i,
         name: 'Open',
         status: 'open',
         statusDate: Date.now()
      });
 
   }
 
   new Room({
         room: randomNum,
         status: 'waiting',
         numPlayers: num,
         opponent: req.body.invited
         players: players
      },
      function( err, game ) {
 
         var data = game.toJSON();
          
         // Respond with game record and 
         // add the player's ID so it can be recorded locally
         data.action = 'start';
         data.player = pid;
 
         res.send( data );
   }).save();
}