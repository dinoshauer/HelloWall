var utils = {
	pckry: new Packery( document.getElementById('message-container'), {
		columnWidth: 150,
		itemSelector: '.message',
		//containerStyle: null
	}),
	messages: [],
	loader: $('<div class="loader"><i class="fa fa-2x fa-refresh fa-spin"></i></div>'),
	error: function(message){
		return '<div class="error hide"><p>Oh no, an error occured!<br />' + message + '</p></div>';
	},
	warning: function(message){
		return '<div class="warning hide"><p>Oh snap!<br />' + message + '</p></div>'
	},
	createMessage: function(message, callback){
		utils.IsValidImageUrl(message, function (image, isImage) {
			if (isImage) {
				callback(utils.createImageTag(message));
				return;
			}

			callback(utils.createMessageTag(message));
		});
	},
	createMessageTag: function (message) {
		if(message.length > 50){
			return '<div class="message w8"><p>' + message.replace(/\n/g, '<br />') + '</p></div>';
		}
		else if (message.length > 20 && message.length < 49) {
			return '<div class="message w8"><p>' + message.replace(/\n/g, '<br />') + '</p></div>';
		}
		
		return '<div class="message"><p>' + message.replace(/\n/g, '<br />') + '</p></div>';
	},
	createImageTag: function(message){
		return '<div class="message"><img src="' + message+ '" /></div>';
	},
	IsValidImageUrl: function (url, callback) {
	    $("<img>", {
            src: url,
            error: function() { callback(url, false); },
            load: function() { callback(url, true); }
        });
	},
	resizeImage: function(image){
		if (!$(image).find('img').length > 0) {
			return;
		}

		var pic = $(image).find('img').get(0);
		$(pic).parent().width(350);
		$(pic).width(350);

		$(image).fadeIn('slow');
	},
	colors: [
		//'#fbbf2f',
		'#ee7338',
		'#21c7da',
		'#00aa8b',
		'#0d66a6',
		'#365f9d'
	],
	i: 0,
	waiting: function(){
		$('body').animate({
			backgroundColor: utils.colors[utils.i]
		}, 30000);
		++utils.i;
		if(utils.i > utils.colors.length){
			utils.i = 0;
		}
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
						utils.waiting();
					}
					if(!$('#initial').is(':visible')){
						$('#initial').fadeIn('slow');
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
					$('.message').fadeOut('slow', function(){
						if(!$('#initial').is(':visible')){
							$('#initial').fadeIn('slow');
						}
					});
				}
				setTimeout(function(){
					$('.warning').fadeOut('slow', function(){
						$(this).remove();
					});
				}, 10000);
				utils.waiting();
			}
			else {
				$('body').animate({
					backgroundColor: '#FFF'
				}, 5000);
				if($('.warning').is(':visible')){
					$('.warning').fadeOut('fast', function(){
						$(this).remove();
					});
				}
				if($('.error').is(':visible')){
					$('.error').fadeOut('fast', function(){
						$(this).remove();
					});
				}
				var initial = $('#initial');
				if(initial.is(':visible')){
					initial.fadeOut('slow', function(){
						$.each(data.data, function(i, item){
							utils.createMessage(item, function (messageItem) {
								var element = $(messageItem);
								$('#message-container').append(element);
								$(messageItem).css('color', utils.colorize()).hide();
								utils.resizeImage(element);
								utils.pckry.appended($(element).get(0));
							});
						});

						utils.messages = data.data;
					});
				}
				else {
					var newDiff = $(data.data).not(utils.messages).get();
					$.each(newDiff, function(i, item){
						utils.createMessage(item, function (messageItem) {
							var element = $(messageItem);
							$('#message-container').append(element);
							$(messageItem).css('color', utils.colorize()).hide();
							utils.resizeImage(element);
							utils.pckry.appended($(element).get(0));
							utils.messages.push(item);
						});
					});
					// Delete old messages
					var oldDiff = $(utils.messages).not(data.data).get();
					if(oldDiff.length > 0){
						$.each(oldDiff, function(i, item){
							var msg = $($('.message:contains("' + item + '")'));
							msg.remove();
							utils.pckry.remove(msg);
							utils.pckry.layout();
						});
					}
				}
			}
		});
	},
	initial: function(interval){
		utils.call('/api/read/simple', 'GET', false);
		setInterval(function(){
			utils.call('/api/read/simple', 'GET', false);
		}, interval);
		return null
	},
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