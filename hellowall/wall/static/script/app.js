var utils = {
	messages: [],
	error: function(message){
		return '<div class="error hide"><p>Oh no, an error occured!<br />' + message + '</p></div>';
	},
	warning: function(message){
		return '<div class="warning hide"><p>Oh snap!<br />' + message + '</p></div>'
	},
	message: function(message){
		return '<div class="message" data-timeout="' + message[1] + '"><p>' + message[0] + '</p></div>'
	},
	call: function(endpoint, type, async, loader, error){
		$.ajax({
			type: type,
			url: endpoint,
			async: async,
			beforeSend: function(){
				// this is where we append a loading image
			},
			success: utils.process,
			error: function(jqXHR, textStatus, errorThrown){
				var error = $(utils.error(jqXHR.responseJSON.error));
				$('body').prepend(error.fadeIn('slow'));
			}
		});
	},
	process: function(data){
		if(!data.result){
			var warning = $(utils.warning('There are no messages!'));
			$('body').prepend(warning.fadeIn('slow'));
		}
		else {
			var initial = $('#initial');
			if(initial.is(':visible')){
				initial.fadeOut('slow', function(){
					this.remove();
					$.each(data.data, function(i, item){
						var msg = $(utils.message(item)).css('color', utils.colorize());
						$('body').append(msg); // TODO: Place, colorsize etc instead of just html()
					});
				});
			}
			else {
				$('body').append(data.data); // TODO: Place, colorsize etc instead of just html()
			}
		}
	},
	initial: function(){
		return null
	},
	update: function(){
		utils.call('/api/read', 'GET', false, $('#loader'), $('#error'));
		return null
	},
	colors: [
		'red',
		'blue',
		'yellow',
		'green',
	],
	colorize: function(){
		return utils.colors[Math.floor((Math.random()*utils.colors.length))]
	},
	resize: function(){
		return null
	},
	place: function(){
		return null
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