jQuery(document).ready(function () {
	var check_status = function (status){
		if (status === 'joined'){
			$('#not_joined').css({'display': 'none'});
			$('#joined').css({'display': 'block'});
		}
		else {
			$('#not_joined').css({'display': 'block'});
			$('#joined').css({'display': 'none'});
		}
	};

	socket = io.connect('https://completethesentence.com/');
//	socket = io.connect('http://localhost:8080/');

	socket.on('join', function (data) {
		check_status(data.status);
	});


});