var utils = {
	loader: $('<div class="loader"><i class="fa fa-2x fa-refresh fa-spin"></i></div>'),
	error: function(message){
		return '<div class="error hide"><p>Oh no, an error occured!<br />' + message + '</p></div>';
	},
	warning: function(message){
		return '<div class="warning hide"><p>Oh snap!<br />' + message + '</p></div>'
	},
	message: function(message){
		return '<li class="message">' + message[0] + '<a href="#" class="sticky" data-key-id="' + message[1] + '">Make this message a sticky</a></li>'
	},
	call: function(endpoint, type, async){
		$.ajax({
			type: type,
			url: endpoint,
			async: async,
			beforeSend: function(){
				$('body').append(utils.loader.fadeToggle('slow'));
			},
			success: utils.process,
			error: function(jqXHR, textStatus, errorThrown){
				utils.loader.fadeIn('slow');
				var error = $(utils.error(jqXHR.responseJSON.error));
				$('body').prepend(error.fadeIn('slow'));
			}
		});
	},
	process: function(data){
		console.log(data);
		utils.loader.fadeOut('slow', function(){
			$(this).remove()
			if(!data.result){
				var warning = $(utils.warning('There are no messages to display!'));
				$('body').prepend(warning.fadeIn('slow'));
			}
			else {
				if($('.warning').is(':visible')){
					$('.warning').fadeOut('fast');
				}
				if($('.error').is(':visible')){
					$('.error').fadeOut('fast');
				}
				$.each(data.data, function(i, item){
					$('ul').append(utils.message(item));
				});
				// else {
				// 	var newDiff = $(data.data).not(utils.messages).get();
				// 	$.each(newDiff, function(i, item){
				// 		var msg = $(utils.message(item)).css('color', utils.colorize());
				// 		$('#message-container').append(msg);
				// 		utils.msnry.appended(msg);
				// 		utils.messages.push(item);
				// 	});
				// 	// Delete old messages
				// 	var oldDiff = $(utils.messages).not(data.data).get();
				// 	if(oldDiff.length > 0){
				// 		$.each(oldDiff, function(i, item){
				// 			var msg = $($('.message:contains("' + item + '")'));
				// 			msg.remove();
				// 			utils.msnry.remove(msg);
				// 			utils.msnry.layout();
				// 		});
				// 	}
				// }
			}
		});
	},
	initial: function(){
		utils.call('/api/read', 'GET', false);
	},
	remove: function(that){
		$(that).fadeOut(function(){
			$(that).remove();
		});
	}
}

// Remove the error box
$('body').on('click', '.error', function(){
	utils.remove(this);
});
// Remove the warning box
$('body').on('click', '.warning', function(){
	utils.remove(this);
});