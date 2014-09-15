/*
$('#container').on('scroll', function () {
    console.log('scroll container');
});

$(function() {

   $("#container").mousewheel(function(event, delta) {
       this.scrollLeft -= (delta * 30);
       event.preventDefault();
   });
});
*/
if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
} else {
    alert('The File APIs are not fully supported in this browser.');
}

			var intOverallDelta = 0;
				
			$("#container").bind('mousewheel', function(e){
                e.preventDefault();
                intOverallDelta -= e.originalEvent.wheelDeltaY;
                //console.log(e.originalEvent.wheelDelta + " overall: " + intOverallDelta);
                $('.scroller').scrollTop(intOverallDelta);
                console.log($('#columns').scrollLeft() + " + " + e.originalEvent.wheelDeltaX);
                $('#columns').scrollLeft($('#columns').scrollLeft() - e.originalEvent.wheelDeltaX);
                /*
			    if (intDelta > 0){
			       intOverallDelta++;
                   console.log(intOverallDelta);
				}
			    else if (intDelta < 0){
					intOverallDelta--;
                   console.log(intOverallDelta);
				}
                */
			});
		


/*
$('.scroller').on('scroll', function () {
            console.log('scrolling1')
    scrolled = this;

    $( '.scroller' ).each(function( index ) {
        //console.log( index + ": " + $( this ).text() );
        if (scrolled != this) {
            $('.scroller').scrollTop($(scrolled).scrollTop());
            console.log('scrolling2')
        }
    });
});
*/
/**
 * 
 * credits for this plugin go to brandonaaron.net
 * 	
 * unfortunately his site is down
 * 
 * @param {Object} up
 * @param {Object} down
 * @param {Object} preventDefault
 */
jQuery.fn.extend({
	mousewheel: function(up, down, preventDefault) {
		return this.hover(
			function() {
				jQuery.event.mousewheel.giveFocus(this, up, down, preventDefault);
			},
			function() {
				jQuery.event.mousewheel.removeFocus(this);
			}
		);
	},
	mousewheeldown: function(fn, preventDefault) {
		return this.mousewheel(function(){}, fn, preventDefault);
	},
	mousewheelup: function(fn, preventDefault) {
		return this.mousewheel(fn, function(){}, preventDefault);
	},
	unmousewheel: function() {
		return this.each(function() {
			jQuery(this).unmouseover().unmouseout();
			jQuery.event.mousewheel.removeFocus(this);
		});
	},
	unmousewheeldown: jQuery.fn.unmousewheel,
	unmousewheelup: jQuery.fn.unmousewheel
});


jQuery.event.mousewheel = {
	giveFocus: function(el, up, down, preventDefault) {
		if (el._handleMousewheel) jQuery(el).unmousewheel();
		
		if (preventDefault == window.undefined && down && down.constructor != Function) {
			preventDefault = down;
			down = null;
		}
		
		el._handleMousewheel = function(event) {
			if (!event) event = window.event;
			if (preventDefault)
				if (event.preventDefault) event.preventDefault();
				else event.returnValue = false;
			var delta = 0;
			if (event.wheelDelta) {
				delta = event.wheelDelta/120;
				if (window.opera) delta = -delta;
			} else if (event.detail) {
				delta = -event.detail/3;
			}
			if (up && (delta > 0 || !down))
				up.apply(el, [event, delta]);
			else if (down && delta < 0)
				down.apply(el, [event, delta]);
		};
		
		if (window.addEventListener)
			window.addEventListener('DOMMouseScroll', el._handleMousewheel, false);
		window.onmousewheel = document.onmousewheel = el._handleMousewheel;
	},
	
	removeFocus: function(el) {
		if (!el._handleMousewheel) return;
		
		if (window.removeEventListener)
			window.removeEventListener('DOMMouseScroll', el._handleMousewheel, false);
		window.onmousewheel = document.onmousewheel = null;
		el._handleMousewheel = null;
	}
};
