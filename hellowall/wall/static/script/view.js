var utils = {
	msnry: new Masonry( document.getElementById('message-container'), {
		// options
		columnWidth: 150,
		itemSelector: '.message',
		containerStyle: null
	}),
	messages: [],
	loader: $('<div class="loader"><i class="fa fa-2x fa-refresh fa-spin"></i></div>'),
	error: function(message){
		return '<div class="error hide"><p>Oh no, an error occured!<br />' + message + '</p></div>';
	},
	warning: function(message){
		return '<div class="warning hide"><p>Oh snap!<br />' + message + '</p></div>'
	},
	message: function(message){
		if(message.length > 50){
			return '<div class="message w8"><p>' + message + '</p></div>'	
		}
		else if(message.length > 20 && message.length < 49){
			return '<div class="message w8"><p>' + message + '</p></div>'
		}
		return '<div class="message"><p>' + message + '</p></div>'
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
				var initial = $('#initial');
				if(initial.is(':visible')){
					initial.fadeOut('slow', function(){
						$(this).remove();
						$.each(data.data, function(i, item){
							var msg = $(utils.message(item.replace(/\n/g, '<br />'))).css('color', utils.colorize());
							$('#message-container').append(msg);
							utils.msnry.appended(msg);
						});
						utils.messages = data.data;
					});
				}
				else {
					var newDiff = $(data.data).not(utils.messages).get();
					$.each(newDiff, function(i, item){
						var msg = $(utils.message(item)).css('color', utils.colorize());
						$('#message-container').append(msg);
						utils.msnry.appended(msg);
						utils.messages.push(item);
					});
					// Delete old messages
					var oldDiff = $(utils.messages).not(data.data).get();
					if(oldDiff.length > 0){
						$.each(oldDiff, function(i, item){
							var msg = $($('.message:contains("' + item + '")'));
							msg.remove();
							utils.msnry.remove(msg);
							utils.msnry.layout();
						});
					}
				}
			}
		});
	},
	initial: function(interval){
		utils.call('/api/read', 'GET', false);
		setInterval(function(){
			utils.call('/api/read', 'GET', false);
		}, interval);
		return null
	},
	colors: [
		//'#fbbf2f',
		'#ee7338',
		'#21c7da',
		'#00aa8b',
		'#0d66a6',
		'#365f9d'
	],
	colorize: function(){
		return utils.colors[Math.floor((Math.random()*utils.colors.length))]
	},
	resize: function(){
		var msgs = $('.message');
		$.each(msgs, function(i, item){
			var timeLeft = $(item).data('timeout');
			$(item).css('font-size', (timeLeft/100*10).toFixed() + 'px');
		});
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