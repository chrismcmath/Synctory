var Step = new Class({
    initialize: function(key, stamp) {
        this.Key = key; // not in order!
        this.Stamp = stamp;
        this.LocationUnitHash = new Hash();
        this.UnitTerminals = [];
    },

    SetNext: function(next) {
        this.NextStep = next; //used for writing to json
    },

    SetStamp: function(stamp) {
        this.Stamp = stamp;
        this.Div.getChildren('.step_stamp')[0].textContent = stamp;
    },

    AddUnitTerminal: function(unit) {
        this.UnitTerminals.push(unit);
    },

    RemoveUnitTerminal: function(unit) {
        this.UnitTerminals.erase(unit);
        if (this.UnitTerminals.length == 0) {
            steps.erase(this);
            this.Div.dispose();
            //TODO: remove from all units, or never have it in units in the first place
        }
    },

    AddUnit: function(unit) {
        var locationKey = unit.LocationKey;
        this.LocationUnitHash[locationKey] = unit;
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
    },

    RequestGrowth: function(unit) {
        // add as terminal too
        //
        var targetedUnit = this.LocationUnitHash[unit.LocationKey];
        if (targetedUnit.Active) {
            console.log('refuse growth, next thing is active');
            return false;
        } else {
            console.log('can grow');
            this.LocationUnitHash[unit.LocationKey] = unit;
            targetedUnit.Div.dispose();
            this.RemoveUnitTerminal(targetedUnit);
            units.erase(targetedUnit);
            this.AddUnitTerminal(unit);
            return true;
        }
    }
});
