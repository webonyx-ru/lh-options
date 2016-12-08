$(document).ready(function(){
	if($('.the_slider').length > 0) {
		$('.the_slider').each(function(){
		    $(this).find(".ui-slider-handle").draggable();

		    var max = $(this).data('max'),
		    	min = $(this).data('min'),
		    	cur = $(this).data('cur'),
		    	$slider = $(this);
		    
		    $(this).slider({
		    	range: "min",
				min: min,
				max: max,
				step:1,
				value: cur,
				slide: 
					function( event, ui ) {
						$slider.closest('.item').find("*[data-change-number]" ).text( ui.value);

						calc_update();
					}
			});

			$slider.find('.ui-slider-handle').append('<span class="handler-icons">');

			$slider.closest('.item').find("*[data-change-number]" ).text( $slider.slider("value"));

			calc_update();
		})
	}

	$('.call_traider_rent_pop').click(function(){
		$('.overlay').fadeIn(200);
		$('.traider_rent_popup').fadeIn(200);
	});

	$('.best_traiders .the_updated').each(function(){
		var date = new Date();
		var day = date.getDate();
		var mon = date.getMonth()+1;

		var year = date.getFullYear();
		if(mon < 10)
			var format_date = day+'.0'+mon+'.'+year;
		else
			var format_date = day+'.'+mon+'.'+year;
		$(this).text(format_date)
	});

	$('.block_up_btn').click(function(){
		$('body, html').animate({scrollTop: 0}, 1000);
	});

	$('.close_popup').click(function(){
		$(this).closest('.popup').fadeOut(200)
		$('.overlay').fadeOut(200);

		if($('.close_popup').closest('.popup.video_block').length > 0) {
			var frame = $('.close_popup').closest('.popup').find('iframe');
			var src = frame.attr('src');
			frame.attr('src', '');
			frame.attr('src', src);
		}
	})

	$('*[data-call-popup]').click(function(e){
		var pop = $(this).attr('data-call-popup');
		$('.overlay').fadeIn(200);
		$('*[data-popup="'+pop+'"]').fadeIn(200);

		e.preventDefault();
	});


	$(document).on('click', '.faq_title.clickable', function(){
		var $item = $(this).closest('.item');
		if($item.hasClass('active')) {
			$(this).siblings('.faq_answers').stop().slideUp(200)
			$item.removeClass('active')
		} else {
			var $active_item = $(this).closest('.faq_units').find('.item.active');

			$active_item.removeClass('active').find('.faq_answers').stop().slideUp(200);
			$item.addClass('active').find('.faq_answers').stop().slideDown(200);

			/*setTimeout(function(){
				$('body, html').animate({scrollTop: $item.offset().top}, 300);
			}, 300)*/
		}
	});

	$('.question_item_block_in_header .answers a').click(function(e){
		var bl = $(this).closest('.question_item_block_in_header');
		var next_bl = bl.next();

		question_animation(bl, next_bl);

		/*if(bl.is(':last-child')) {
			bl.slideUp(200);
			$('.first-screen-will-be-hidden-on-question-show').slideDown(200);
		} else {
			bl.slideUp(200);
			next_bl.slideDown(200);
		}*/
		
		e.preventDefault();
	});

	var fixed = false;

	$('*[data-call-questions]').click(function(e){
		$('.head_line *[data-call-questions]').addClass('hidden');
		$('.hidden_header_buttons').removeClass("hidden");
		$('.first-screen-will-be-hidden-on-question-show').addClass('hidden_opacity').css({opacity: 0});
		$('.hidden_questions_block_animation').addClass('activated');
		$('[data-question-number="1"]').addClass('active');
		first_block_height();
		e.preventDefault();
	});

	$('*[data-move-to-top]').click(function(e){
		$('body, html').animate({scrollTop: 0}, 500)
		e.preventDefault();
	})

	$('*[data-call-question]').click(function(e){
		if(fixed == true) {
			e.preventDefault();
			return;
		}

		var lnum = $('.the_plate_item_in_questions_block_animated.active[data-question-plate-moving]').attr('data-question-plate-moving');
		var qnum = $(this).data('call-question');
		var pnum = $(this).data('call-plate');

		if(pnum == 4 || pnum == 2) {
			fixed = true;
			$('.question_item_will_move .answers').fadeOut(200);
		}


		if(qnum != null) {
			$('.question_item_will_move.active[data-question-number]').addClass('remove').removeClass('active');
			$('.question_item_will_move[data-question-number="'+qnum+'"]').addClass('active');
		}


		if(lnum != pnum) {
			$('.the_plate_item_in_questions_block_animated.active[data-question-plate-moving]').addClass('remove').removeClass('active')
			$('.the_plate_item_in_questions_block_animated[data-question-plate-moving="'+pnum+'"]').addClass('active')
		}

		first_block_height();
		e.preventDefault();
	});

	up_btn_vis();

	$(window).scroll(function(){
		up_btn_vis();
		menu_header();
	})
	menu_detect()

	$(window).resize(function(){
		menu_detect()
	})

	function menu_detect() {
		if(viewport().width <= 992) {
			$('.header_menu').removeClass('desctop_menu')
		} else {
			$('.header_menu').addClass('desctop_menu')
		}
	}

	if($('.tel_mask').length > 0)
		$('.tel_mask').mask('+7 (999) 999-99-99')

	$('.menu_icon').click(function(){
		$(this).closest('.header_menu').toggleClass('active');
	});

	var Timeout;

	$('.header_menu .menu_icon').hover(function(){
		clearTimeout(Timeout);
		$('.header_menu').addClass('active');
	});

	$('.header_menu').on('mouseleave', function(){
		Timeout = setTimeout(function(){
			$('.header_menu').removeClass('active');
		}, 500)
	});

	if($(window).width() <= 992) {
		$('.has_sub > a').click(function(e){
			// if(!$(this).hasClass('pad_sub_activate_element')) {
			$(this).closest('li').addClass('pad_sub_activate_element').closest('.header_menu').addClass('pad_sub_activated');
			// } else {
			// 	$(this).removeClass('pad_sub_activate_element').closest('.header_menu').removeClass('pad_sub_activated');
			// }
			e.preventDefault();
		});
	}

	$('.submenu .back_link').click(function(e){
		$(this).closest('.has_sub').removeClass('pad_sub_activate_element');
		$(this).closest('.header_menu').removeClass('pad_sub_activated')

		e.preventDefault();
	});

	$('.has_third_lvl > a').click(function(e){
		e.preventDefault();

		var bl = $(this).closest('li');

		bl.addClass('third_lvl_active_element').closest('.has_sub').addClass('hide_submenu_elements').closest('.header_menu').addClass('third_lvl_activated');
	});

	$('.back_link_lvl3').click(function(e){
		var bl = $(this);

		bl.closest('.third_lvl_active_element').removeClass('third_lvl_active_element')
		bl.closest('hide_submenu_elements').removeClass('hide_submenu_elements');
		$('.header_menu').removeClass('third_lvl_activated')
	})

	menu_header();
})

function menu_header() {
	/*var scrollTop = $(window).scrollTop();
	var menu_pos = $('.head_line').offset().top + $('.head_line').outerHeight() + 3;

	if(scrollTop >= menu_pos) {
		$('.header_menu').addClass('fixed');
	} else {
		$('.header_menu').removeClass('fixed');
	}*/
}

function calc_update() {
	var start_capital = parseInt($('#start_money').text()),
		pers = 1.02,
		days = parseInt($('#trade_days').text()),
		trades = parseInt($('#trades_per_day').text()),
		total_trades = trades*days,
		stepen = Math.pow(pers, total_trades),
		total_profit_per_day = Math.round((start_capital*stepen));

		// console.log(total_profit_per_day)

		var height = total_profit_per_day*0.01;

		$('*[data-total-per-day]').text(total_profit_per_day);
		$('.blue_coin').css({'height': height})
}

function question_animation(last_block, current_block) {
	var old_q = last_block.find('.question_item_will_move:eq(0)');
	var old_plate = last_block.find('.right_side_content_questions:eq(0)');
	var new_q = current_block.find('.question_item_will_move:eq(0)');
	var new_plate = current_block.find('.right_side_content_questions:eq(0)');

	//old_q.animate({transform: 'translate(-1000px)', opacity: 0}, 500);
	old_q.addClass('remove');

	new_q.addClass('active');
}

function first_block_height() {
	// $('.first-screen-will-be-hidden-on-question-show').
	if($('.right_side_content_questions.active').length > 0) {
		var delta = Math.abs($('.right_side_content_questions.active').offset().top - $('.header').offset().top) + $('.right_side_content_questions.active').outerHeight();

		// console.log($('.right_side_content_questions.active').outerHeight())
		$('.header .first-screen-will-be-hidden-on-question-show').css({height: delta});
	} else {
		var delta = Math.abs($('.question_item_will_move.active').offset().top - 80 - $('.header').offset().top) + $('.question_item_will_move.active').height();

		// console.log(delta)
		$('.header .first-screen-will-be-hidden-on-question-show').css({height: delta-80});
	}
}


function rnd(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function up_btn_vis() {
	var wp = $(window).scrollTop();
	var wh = $(window).height();

	if(wp > wh)
		$('.block_up_btn').fadeIn(200);
	else
		$('.block_up_btn').fadeOut(200);
}

function viewport() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}