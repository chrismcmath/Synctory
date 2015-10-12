var Step = new Class({
    initialize: function(key, stamp) {
        this.Key = key; // not in order!
        this.Stamp = stamp;
        this.LocationUnitDict = {};
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
        Object.each(this.LocationUnitDict, function(unit, locationKey) {
            unit.RemoveStep(key);
        });
    },

    AddUnit: function(unit) {
        var locationKey = unit.LocationKey;
        this.LocationUnitDict[locationKey] = unit;
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
        var biggestTop = 0;
        Array.each(this.UnitTerminals, function(unit, index){
            unit.SetBottomY(bottomY);
            var unitTop = unit.Div.getPosition().y;
            if (unitTop > biggestTop) {
                biggestTop = unitTop;
            }
        });

        //TODO: This is run twice for each step when initialising, check ordering
        //NOTE: getting position from Unit, as step is unreliable (pos only gets updated after this frame)
        if (this.UnitTerminals.length == 0) {
            return;
        }
        var height = bottomY - biggestTop;

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
        var targetedUnit = this.LocationUnitDict[unit.LocationKey];
        if (targetedUnit.Active) {
            //console.log('refuse growth, next thing is active');
            return false;
        } else {
            this.LocationUnitDict[unit.LocationKey] = unit;
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

        var step = this;
        this.Div.addEvent('click', function(event){
            event.stop();
            Rename("STAMP STEP", step.Stamp, false, function(value) {
                step.Stamp = value;
                step.Div.getElement('.step_stamp').textContent= step.Stamp;
            });
        });

        CheckHeightIncrease();
    },

    GetAllEntities: function() {
        var entities = [];
        Object.each(this.LocationUnitDict, function(unit, locationKey) {
            entities.append(unit.Entities);
        });
        return entities;
    },

    GetDupes: function() {
        var entities = this.GetAllEntities();
        var dupes = [];
        Array.each(entities, function (entity, index) {
            if (entities.filter(function(e) { return e == entity; }).length > 1) {
                dupes.push(entity);
                entities.erase(entity);
            }
        });
        return dupes;
    },

    CheckEntityConflict: function() {
        var dupes = this.GetDupes();

        var step = this;
        if (dupes.length > 0) {
        Array.each(dupes, function (dupe, index) {
            Object.each(step.LocationUnitDict, function(unit, locationKey) {
                //console.log("Dupe: " + dupe + " step: " + step.Key + " location: " + location + "unit: " + unit.Key);
                if (unit.Entities.contains(dupe)) {
                    //console.log('has conflict');
                    unit.AddConflict(dupe);
                } else {
                    //console.log('no conflict');
                    unit.RemoveConflict();
                }
            });
        });
        } else {
            Object.each(step.LocationUnitDict, function(unit, locationKey) {
                unit.RemoveConflict();
            });
        }
    },

    UnitHasConflict: function(unit) {
        var hasConflict = false;
        var dupes = this.GetDupes();
        Array.each(dupes, function (dupe, index) {
            if (unit.Entities.contains(dupe)) {
                hasConflict = true;
                return;
            }
        });
        return hasConflict;
    }
});
