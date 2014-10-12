var Page = {
    initialize: function() {
        // nice one David Walsh	(via rickyh.co.uk)

        if(document.id("footerTab")){
            document.id("footerTab").set('morph', {
                duration: 500,
                transition: 'Sine:out'
            });
            setTimeout(function(){

                document.id("footerTab").morph({
                    'bottom': ['-27px','0px']
                });

            },750);
        }

        var locationTitles = new ScrollSpy({
            min: 0, // acts as position-x: absolute; left: 50px;
            mode: 'vertical',
            onEnter: function(position,enters) {

            },
            onLeave: function(position,leaves) {

            },
            onTick: function(position,state,enters,leaves) {
                $$(".location_title_column").each(function(title)  {
                    title.style.top = (position.y + 5) +"px";
                }); 
            },
            container: window
        }); 


        var stepPanel = new ScrollSpy({
            min: 0, // acts as position-y: absolute; bottom: 50px;
            mode: 'vertical',
            onEnter: function(position,enters) {

            },
            onLeave: function(position,leaves) {

            },
            onTick: function(position,state,enters,leaves) {
                document.id("step_panel").style.top = -position.y+"px";
            },
            container: window
        }); 
        stepPanel.fireEvent('tick',[stepPanel.container.getScroll(),stepPanel.inside,stepPanel.enters,stepPanel.leaves]);
    }
}

window.addEvent("domready", Page.initialize);
