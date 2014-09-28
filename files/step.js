var Step = new Class({
    initialize: function(key, stamp) {
        this.Key = key; // not in order!
        this.Stamp = stamp;
        this.UnitTerminals = [];
    },

    SetNext: function(next) {
        this.NextStep = next; //used for writing to json
    },

    AddUnitTerminal: function(unit) {
        this.UnitTerminals.push(unit);
    },

    GetMaxBottomY: function(bottomY) {
        Array.each(this.UnitTerminals, function(unit, index){
            var unitBottomY = unit.GetBottomY();
            if (unitBottomY > bottomY) {
                bottomY = unitBottomY;
            }
        });
        return bottomY;
    },

    SetBottomY: function(bottomY) {
        Array.each(this.UnitTerminals, function(unit, index){
            unit.SetBottomY(bottomY);
        });

        var height = bottomY - this.Div.getPosition().y;
        console.log('step set height to ' + height);
        this.Div.setStyle('height', height + 'px');
    },

    Reposition: function() {
        var bottomY = 0;
        bottomY = this.GetMaxBottomY(bottomY);
        this.SetBottomY(bottomY);
    }
});
