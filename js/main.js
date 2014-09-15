var JSON_FILE = "json";
var SYNCTORY_FILE = "synctory";

if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
} else {
    alert('The File APIs are not fully supported in this browser.');
}

function handleFileSelect(evt) {
    console.log("handleFileSelect " + evt);
    var file = evt.target.files[0]; // FileList object
    var split_parts = file.name.split(".");
    console.log(" got " + file +
            "name: " + file.name +
            "type: " + file.type +
            "size: " + file.size +
            "beg: " + split_parts[0] +
            "end: " + split_parts[split_parts.length -1]);

    var file_type = split_parts[split_parts.length -1];
    if (!(file_type.toLowerCase() == SYNCTORY_FILE || file_type.toLowerCase() == JSON_FILE)) {
        alert("Please choose a .synctory (or JSON) file");
        return;
    }

    var reader = new FileReader();

    /*
    console.log("before onload");
      // Closure to capture the file information.
      reader.onload = (function(theFile) {
            console.log("in result");
            var jsonString = reader.readAsText(theFile);
            debugger;
        return function(e) {
            console.log("result: " + e.target.result);
        };
      })(file);
    console.log("after onload");

    */
        // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e) { 
            JsonObj = e.target.result
            console.log(JsonObj);
            var parsedJSON = JSON.parse(JsonObj);
            debugger;
            //var x = parsedJSON['frames']['chaingun.png']['spriteSourceSize']['x'];
            console.log(parsedJSON);

        };
    })(file);

    reader.readAsText(file, 'UTF-8');

    //var jObject = JSON.Parse(FileReader.readAsText(file


    // files is a FileList of File objects. List some properties.
     /*
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
    */
}

document.getElementById('file').addEventListener('change', handleFileSelect, false);


var intOverallDelta = 0;

$("#container").bind('mousewheel', function(e){
    e.preventDefault();
    intOverallDelta -= e.originalEvent.wheelDeltaY;
    //console.log(e.originalEvent.wheelDelta + " overall: " + intOverallDelta);
    $('.scroller').scrollTop(intOverallDelta);
    console.log($('#columns').scrollLeft() + " + " + e.originalEvent.wheelDeltaX);
    $('#columns').scrollLeft($('#columns').scrollLeft() - e.originalEvent.wheelDeltaX);
});



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
