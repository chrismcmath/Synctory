var Step = new Class({
    initialize: function(key, stamp) {
        this.Key = key; // not in order!
        this.Stamp = stamp;
        this.LocationUnitHash = new Hash();
        this.UnitTerminals = [];
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
            this.RemoveStep();
        }
    },

    RemoveStep: function() {
        /* Hack - because step stamps are for when the step beings,
         * but our logic is from when the step terminates,
         * copy across the stamp here to make it look like it's the other one */
        var nextStep = steps[steps.indexOf(this) +1];
        nextStep.SetStamp(this.Stamp);

        steps.erase(this);
        this.Div.dispose();

        var key = this.Key;
        this.LocationUnitHash.each(function(unit, location) {
            unit.RemoveStep(key);
        });
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
            this.LocationUnitHash[unit.LocationKey] = unit;
            targetedUnit.Div.dispose();

            // order imp
            this.AddUnitTerminal(unit);
            this.RemoveUnitTerminal(targetedUnit);

            units.erase(targetedUnit);
            return true;
        }
    },

    CreateDiv: function() {
        this.Div = new Element("div", {
            'class': 'step',
            'id': 'step_' + this.Key
        });
        var stampDiv = new Element("div", {
            text: this.Stamp,
            'class': 'step_stamp clear_all'
        });
        document.id(this.Div).adopt(stampDiv);
    },

    CheckEntityConflict: function() {
        /* get all entities */
        var entities = [];
        this.LocationUnitHash.each(function(unit, location) {
            entities.append(unit.Entities);
        });

        var dupes = [];
        Array.each(entities, function (entity, index) {
            if (entities.filter(function(e) { return e == entity; }).length > 1) {
                dupes.push(entity);
                entities.erase(entity);
            }
        });

        var step = this;
        if (dupes.length > 0) {
        Array.each(dupes, function (dupe, index) {
            step.LocationUnitHash.each(function(unit, location) {
                if (unit.Entities.contains(dupe)) {
                    console.log('has conflict');
                    unit.HasConflict();
                } else {
                    console.log('no conflict');
                    unit.NoConflict();
                }
            });
        });
        } else {
            step.LocationUnitHash.each(function(unit, location) {
                console.log('no conflict');
                unit.NoConflict();
            });
        }
    }
});