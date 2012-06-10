/*!
 * tTooltip v0.1
 *
 * Copyright 2012 Takien, No Inc
 * http://takien.com
 * 
 * Licensed under the Apache License v2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * follow @cektkp and @perdanaweb
 */
(function($) {
	function arrow_pos(el){
		var pos = el.position();
		var top = pos.top-$(window).scrollTop();
		var left = pos.left-$(window).scrollLeft();
		var right = $(window).width()-(left+el.width());
		var bottom = $(window).height()-(top+el.height());
		var ret = 'topleft';
		if(top > bottom){
			ret = 'bottom';
		} else {
			ret = 'top';
		}
		
		if(left > right){
			ret += 'right';
		}
		else{
			ret += 'left';
		}

		return ret;
	}
	$.fn.ttooltip = function(customOptions) {  
		var o = $.extend({}, $.fn.ttooltip.defaultOptions, customOptions);
		var tp = $(o.template);
		var c = tp.find('.ttooltip-content');
		var t = tp.find('.ttooltip-title');
		var f = tp.find('.ttooltip-footer');
		tp.css({
			'position':'absolute',
			'max-width':o.maxwidth
		});
		
		

		return this.each(function(index) {
			var tt = $(this);
			tt.bind(o.trigger,function(e){
		
				/* append template to body*/
				tp.appendTo(document.body);

				/* update tp object to the newest dom */
				tp = $('.ttooltip-wrap');
				c = tp.find('.ttooltip-content');
				t = tp.find('.ttooltip-title');
				f = tp.find('.ttooltip-footer');
				
				/* collect data from link attribute */
				var title   = tt.attr('data-title');
				var content = tt.attr('data-content');
				var footer  = tt.attr('data-footer');
				var href    = tt.attr('href');
				var width   = tt.attr('data-width');
				
				/* add clearfix to the footer */
				c.addClass('clearfix');
				f.addClass('clearfix');
				
				/* remove any position class, then update with new position class */
				tp
				.removeClass()
				.addClass('ttooltip-wrap ttooltip-'+arrow_pos(tt))
				.fadeIn();
							
				var arrow 	= tp.find('.ttooltip-arrow');
				var mouseleft = e.pageX-((arrow.outerWidth()*0.5)+arrow.position().left);
				var mousetop;
				
				/* set the content */
				/* if content is ajax, get data from href attribute */
				if(content == 'ajax'){
					$.get(href,function(data){
						tp.find('.ttooltip-inner').html(data);
					});
				}
				else {
					t.show().html(title);
					c.show().html(content);
					f.show().html(footer);
					
					/* hide footer if empty */
					if(footer==undefined){
						f.hide();
					}
					/* hide title if empty */
					if(title==undefined){
						t.hide();
					}

				}

				
				
				/* update top position */
				
				mousetop = tt.position().top+tt.outerHeight()+arrow.outerHeight();
				if((arrow_pos(tt) == 'bottomright') || (arrow_pos(tt) == 'bottomleft')){
					mousetop = tt.position().top-tp.outerHeight()-arrow.outerHeight();
				}
				
				tp
				.css({
					'top'  : mousetop,
				    'left' : mouseleft,
					'width': width,
					'opacity':1
				})
				.fadeIn();
				
				/* follow mouse movement, horizontal only */
				if(o.followmouse) {
					$(this).mousemove(function(x){
						tp.css({
							'top':mousetop,
							'left':x.pageX-arrow.position().left
						})
					});
				}
				/* close on mouseleave*/
				if(o.autohide){
					tp.bind(o.close,function(){
						close(tp);
					});
				}
				/* close on esc */
				if(o.closeonesc){
					document.onkeydown = function(evt) {
					evt = evt || window.event;
						if (evt.keyCode == 27) {
							close(tp);
						}
					};
				}
				
				function close(what){
					what.fadeOut(o.fadespeed,function(){what.remove()});
				}
				
				e.preventDefault();
			});
			
		}); /* end loop*/

	};
 
	$.fn.ttooltip.defaultOptions = {
		autohide	: true,
		followmouse : true,
		closeonesc  : true,
		content		: '',
		title		: '',
		trigger		: 'mouseenter',
		close		: 'mouseleave',
		maxwidth	: 500,
		fadespeed	: 'slow',
		template	: '<div class="ttooltip-wrap"><div class="ttooltip-arrow ttooltip-arrow-border"></div><div class="ttooltip-arrow"></div><div class="ttooltip-inner"><h3 class="ttooltip-title"></h3><div class="ttooltip-content"><p></p></div><div class="ttooltip-footer"></div></div></div>'
	};
})(jQuery);