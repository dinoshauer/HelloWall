var utils = {
	loader: $('<div class="loader"><i class="fa fa-2x fa-refresh fa-spin"></i></div>'),
	error: function(message){
		return '<div class="error hide"><p>Oh no, an error occured!<br />' + message + '</p></div>';
	},
	warning: function(message){
		return '<div class="warning hide"><p>Oh snap!<br />' + message + '</p></div>'
	},
	message: function(message){
		if(message[1] === null){
			return '<li>' + message[0] + '</li>'
		}
		return '<li>' + message[0] + ' &middot; <a href="#" class="sticky" data-key-id="' + message[1] + '">Make this message a sticky</a> or <a href="#" class="delete" data-key-id="' + message[1] + '">delete it</a></li>'
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
				utils.loader.fadeIn('slow', function(){
					var error = $(utils.error(jqXHR.responseJSON.error));
					if(!$('.error').is(':visible')){
						$('body').prepend(error.fadeIn('slow'));
					}
				});
				utils.loader.fadeOut('slow');
			}
		});
	},
	process: function(data){
		utils.loader.fadeOut('slow', function(){
			$(this).remove()
			if(!data.result){
				if(!$('.warning').is(':visible')){
					var warning = $(utils.warning('There are no messages to display!'));
					$('body').prepend(warning.fadeIn('slow'));
				}
				$('ul').html(utils.message(['No posts found.', null]));
			}
			else {
				if($('.warning').is(':visible')){
					$('.warning').fadeOut('fast');
				}
				if($('.error').is(':visible')){
					$('.error').fadeOut('fast');
				}
				$('ul').fadeOut('slow', function(){
					$(this).empty();
					$.each(data.data, function(i, item){
						$('ul').append(utils.message(item));
					});
				})
				$('ul').fadeIn('slow');
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