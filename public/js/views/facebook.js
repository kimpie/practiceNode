window.fbAsyncInit = function() {
    // init the FB JS SDK
    FB.init({
      appId      : '611324685593536',                        // App ID from the app dashboard
      frictionlessRequests : true,
      status     : true,                                 // Check Facebook Login status
      xfbml      : true                                  // Look for social plugins on the page
    });

    // Additional initialization code such as adding Event Listeners goes here

  // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
  // for any authentication related change, such as login, logout or session refresh. This means that
  // whenever someone who was previously logged out tries to log in again, the correct case below 
  // will be handled. 
  FB.Event.subscribe('auth.authResponseChange', function(response) {
    // Here we specify what we do with the response anytime this event occurs. 
    if (response.status === 'connected') {
      // The response object is returned with a status field that lets the app know the current
      // login status of the person. In this case, we're handling the situation where they 
      // have logged in to the app.
      testAPI();
      $(".loggedin").css('display', 'block');
      $(".loggedoff").css('display', 'none');
    } else if (response.status === 'not_authorized') {
      // In this case, the person is logged into Facebook, but not into the app, so we call
      // FB.login() to prompt them to do so. 
      // In real-life usage, you wouldn't want to immediately prompt someone to login 
      // like this, for two reasons:
      // (1) JavaScript created popup windows are blocked by most browsers unless they 
      // result from direct interaction from people using the app (such as a mouse click)
      // (2) it is a bad experience to be continually prompted to login upon page load.
      $(".loggedin").css('display', 'none');
      $(".loggedoff").css('display', 'block');
    } else {
      // In this case, the person is not logged into Facebook, so we call the login() 
      // function to prompt them to do so. Note that at this stage there is no indication
      // of whether they are logged into the app. If they aren't then they'll see the Login
      // dialog right after they log in to Facebook. 
      // The same caveats as above apply to the FB.login() call here.
      $(".loggedin").css('display', 'none');
      $(".loggedoff").css('display', 'block');
    }
  });
};  //fbAsyngInit

  // Load the SDK asynchronously
(function(){
 // If we've already installed the SDK, we're done
 if (document.getElementById('facebook-jssdk')) {return;}

 // Get the first script element, which we'll use to find the parent node
 var firstScriptElement = document.getElementsByTagName('script')[0];

 // Create a new script element and set its id
 var facebookJS = document.createElement('script'); 
 facebookJS.id = 'facebook-jssdk';

 // Set the new script's source to the source of the Facebook JS SDK
 facebookJS.src = '//connect.facebook.net/en_US/all.js';

 // Insert the Facebook JS SDK into the DOM
 firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
}());

// Here we run a very simple test of the Graph API after login is successful. 
  // This testAPI() function is only called in those cases. 
function testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function(info) {
    console.log(info);
  });
};

function requestDialog() {
  FB.ui({method: 'apprequests',
     message: 'Play Complete the Sentence game with me! It\'s hilaious!' 
    });
};

//function newGame () {
    //enter info here to start rooms/authorization

//};

  jQuery('#social').click(requestDialog);

  //jQuery('#console').click(newGame);



//End of Facebook Scripts



//Begining of game scripts
jQuery(document).ready(function () {
  var log_chat_message = function (message, type) {
    var li = jQuery('<li />').text(message);
    
    if (type === 'system') {
      li.css({'font-weight': 'bold'});
    } 
    else if (type === 'leave') {
      li.css({'font-weight': 'bold', 'color': '#F00'});
    }
    else {
      li.css({'display': 'inline'});
    } 
    jQuery('#chat_log').append(li);
  };
  
  var display_id = function testAPI() {
    FB.api('/me', function(info) {
      jQuery('#display_name').append(info.first_name);
    });
  };


  var socket = io.connect('https://completethesentence.com/');
  //var socket = io.connect('http://localhost');


  socket.on('users', function (data){
    display_id(data.name, 'mine');
  });

  socket.on('entrance', function (data){
    log_chat_message(data.message, 'system');
  });

  socket.on('exit', function (data) {
    log_chat_message(data.message, 'leave');
  });

  socket.on('chat', function (data) {
    log_chat_message(data.message, 'normal');
  });

  jQuery('#chat_box').keypress(function (event) {
    if (event.which == 32) {
      socket.emit('chat', {message: jQuery('#chat_box').val()});
      jQuery('#chat_box').val('');
    }
  });

  jQuery('#chat_box').keypress(function (event) {
    if (event.which == 13) {
      socket.emit('chat', {message: jQuery('#chat_box').val()});
      jQuery('#chat_box').val('');
    }
  });
});
