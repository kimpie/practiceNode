window.fbAsyncInit = function() {
    // init the FB JS SDK
    FB.init({
      appId      : '611324685593536',                        // App ID from the app dashboard
      frictionlessRequests : true,
      status     : true,                                 // Check Facebook Login status
      xfbml      : true                                  // Look for social plugins on the page
    });

    // Additional initialization code such as adding Event Listeners goes here

    FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {
    // the user is logged in and has authenticated your
    // app, and response.authResponse supplies
    // the user's ID, a valid access token, a signed
    // request, and the time the access token 
    // and signed request each expire
    var uid = response.authResponse.userID;
    var accessToken = response.authResponse.accessToken;
  } else if (response.status === 'not_authorized') {
    // the user is logged in to Facebook, 
    // but has not authenticated your app
  } else {
    // the user isn't logged in to Facebook.
    window.top.location = 'https://www.facebook.com/index.php';
  }
 }); //FB.getLoginStatus
};  //fbAsyngInit

function goLogIn() {
  FB.login(function(response){
    //handle the response
    $(".loggedin").css('display', 'block');
    $(".loggedoff").css('display', 'none');
  }, {scope: 'email, user_likes'}); //FB.login

}; //goLogIn


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

//Start Game code
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

  var display_id = function (name, currentUser) {
    var name = jQuery('<ul />').text(name + "  ");
    jQuery('#display_name').append(name);
  };

  jQuery('.loggedoff').click(goLogIn);

  
  var socket = io.connect('http://completethesentence.com/');
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
