var utils = {
	loader: $('<div class="loader"><i class="fa fa-2x fa-refresh fa-spin"></i></div>'),
	error: function(message){
		return '<div class="error hide"><p>Oh no, an error occured!<br />' + message + '</p></div>';
	},
	warning: function(message){
		return '<div class="warning hide"><p>Oh snap!<br />' + message + '</p></div>'
	},
	success: function(message){
		return '<div class="success hide"><p>Aww yeah!<br />' + message + '</p></div>'
	},
	message: function(message){
		if(message[1] === null){
			return '<li>' + message[0] + '</li>'
		}
		return '<li>' + message[0] + ' &middot; <a href="#" class="sticky" data-key-id="' + message[1] + '">Make this message a sticky</a> or <a href="#" class="delete" data-key-id="' + message[1] + '">delete it</a></li>'
	},
	call: function(endpoint, type, async, params, successCallback){
		$.ajax({
			type: type,
			url: endpoint,
			async: async,
			data: params,
			beforeSend: function(){
				$('body').append(utils.loader.fadeToggle('slow'));
			},
			success: successCallback,
			error: function(jqXHR, textStatus, errorThrown){
				console.log(jqXHR);
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
	processStatus: function(data){
		utils.loader.fadeOut('slow', function(){
			$('body').append($(utils.success(data.message)).fadeIn('slow'));
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
				setTimeout(function(){
					$('.warning').fadeOut('slow', function(){
						$('ul').html(utils.message(['No posts found.', null]));
					});
				}, 10000);
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
		utils.call('/api/read', 'GET', false, null, utils.process);
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
// Remove the warning box
$('body').on('click', '.success', function(){
	utils.remove(this);
});
var checkForBanner = 0;
// Sticky posts
$('ul').on('click', '.sticky', function(){
	utils.call('/api/sticky', 'POST', false, $.param({ key: $(this).data('key-id') }), utils.processStatus);
	$(this).parent().fadeOut('slow', function(){
		$(this).remove();
	})
	utils.call('/api/read', 'GET', false, null, utils.process);
	checkForBanner = setInterval(function(){
						if($('.success').is(':visible')){
							setTimeout(function(){
								$('.success').fadeOut('slow', function(){
									$(this).remove();
									checkForBanner = 0;
								});
							}, 5000);
						};
					}, 15000);
});
// Delete posts
$('ul').on('click', '.delete', function(){
	utils.call('/api/delete', 'POST', false, $.param({ key: $(this).data('key-id') }), utils.processStatus);
	$(this).parent().fadeOut('slow', function(){
		$(this).remove();
	})
	utils.call('/api/read', 'GET', false, null, utils.process);
	checkForBanner = setInterval(function(){
						if($('.success').is(':visible')){
							setTimeout(function(){
								$('.success').fadeOut('slow', function(){
									$(this).remove();
									checkForBanner = 0;
								});
							}, 5000);
						};
					}, 15000);
});
