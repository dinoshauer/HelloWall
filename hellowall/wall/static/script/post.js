var utils = {
	error: function(message){
		return '<div class="error hide"><p>Oh no, an error occured!<br />' + message + '</p></div>';
	},
	warning: function(message){
		return '<div class="warning hide"><p>Oh snap!<br />' + message + '</p></div>'
	},
	success: function(message){
		return '<div class="success hide"><p>Aww yeah!<br />' + message + '</p></div>'
	},
	loader: $('<div class="loader"><i class="fa fa-2x fa-refresh fa-spin"></i></div>'),
	call: function(endpoint, data, type, async, loader, error){
		$.ajax({
			type: type,
			url: endpoint,
			async: async,
			data: data,
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
		utils.loader.fadeOut('slow', function(){
			$('body').append($(utils.success(data.result)).fadeIn('slow'));
			$('#post').removeAttr('disabled');
		});
	},
	post: function(msg){
		var payload = $.param({message: msg})
		utils.call('/api/post', payload, 'POST', false);
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