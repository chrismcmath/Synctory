var Unit = new Class({
    initialize: function(key, locationKey, startStep, lastStep, entities, text) {
        this.Key = key;
        this.LocationKey = locationKey;
        this.StartStep = startStep;
        this.LastStep = lastStep;
        //this.Length = length;
        this.Entities = entities;
        this.Text = text;
    },

    GetLastStep: function() {
        return this.StartStep + this.Length;
    },

    GetBottomY: function() {
        //console.log('unit ' + this.Key + ' GET bottom: ' + (this.Div.getPosition().y + this.Div.getScrollSize().y));
        return this.Div.getPosition().y + this.Div.getScrollSize().y;
    },

    SetBottomY: function(bottomY) {
        var height = bottomY - this.Div.getPosition().y;
        //console.log('unit ' + this.Key  + ' SET height to ' + height);
        this.Div.setStyle('height', height + 'px');
    }
});
