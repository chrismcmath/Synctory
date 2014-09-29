var Unit = new Class({
    initialize: function(key, locationKey, steps, entities, text, active) {
        this.Key = key;
        this.LocationKey = locationKey;
        this.Steps = steps;
        this.Entities = entities;
        this.Text = text;
        this.Active = active;
    },

    GetLastStepKey: function() {
        return this.Steps.getLast();
    },

    GetBottomY: function() {
        //console.log('unit ' + this.Key + ' GET bottom: ' + (this.Div.getPosition().y + this.Div.getScrollSize().y));
        return this.Div.getPosition().y + this.Div.getScrollSize().y;
    },

    SetBottomY: function(bottomY) {
        var height = bottomY - this.Div.getPosition().y;
        //console.log('unit ' + this.Key  + ' SET height to ' + height);
        this.Div.setStyle('height', height + 'px');
    },

    CreateUnitHTML: function() {
        if (this.Active) {
            this.CreateActive();
        } else {
            this.CreateActive();
            this.CreateInactive();
        }
    },

    CreateActive: function() {
        var unit = this;

        this.Div = new Element("div", {
            'class': 'unit clear_all',
        'id': 'unit_' + this.Key
        });
        this.TextDiv = new Element("textarea", {
            text: this.Text,
            'class': 'unit_script unit_activated'
        });
        var header = new Element("div", {
            'class': 'unit_header unit_activated'
        });
        var headerDivide = new Element("div", {
            'class': 'unit_divide unit_divide_header'
        });
        var splitButton = new Element("div", {
            html: '&#247;',
            'class': 'split_unit unit_button'
        });
        splitButton.addEvent('click', function(event){
            event.stop();
            unit.OnSplit();
        });
        var closeButton = new Element("div", {
            html: '&#9679;',
            'class': 'close_unit unit_button'
        });
        closeButton.addEvent('click', function(event){
            event.stop();
            unit.OnClose();
        });
        header.adopt(headerDivide);
        header.adopt(splitButton);
        header.adopt(closeButton);
        var footer = new Element("div", {
            'class': 'unit_footer unit_activated'
        });
        var footerDivide = new Element("div", {
            'class': 'unit_divide unit_divide_footer'
        });
        var shrinkButton = new Element("div", {
            html: '-',
            'class': 'shrink_unit unit_button'
        });
        shrinkButton.addEvent('click', function(event){
            event.stop();
            unit.OnShrink();
        });
        var growButton = new Element("div", {
            html: '+',
            'class': 'grow_unit unit_button'
        });
        growButton.addEvent('click', function(event){
            event.stop();
            unit.OnGrow();
        });
        footer.adopt(footerDivide);
        footer.adopt(growButton);
        footer.adopt(shrinkButton);
        this.Div.adopt(header);
        this.Div.adopt(this.TextDiv);
        this.Div.adopt(footer);
        $(GetLocationIDFromKey(this.LocationKey)).adopt(this.Div);
    },

    CreateInactive: function() {
        Array.each(this.Div.getElements('.unit_activated'), function (child, index) {
            child.set({
                styles: {
                    display: 'none'
                }
            });
        });

        var plusDiv = new Element("div", {
            html: '&#9679;',
            'class': 'add_unit'
        });
        this.Div.adopt(plusDiv);
        this.Div.addClass('unit_inactive');

        var unit = this;
        this.Div.addEvent('click', function(event){
            event.stop();
            unit.ConvertToActive();
            RefreshFrom(unit.StartStep);
        });
    },

    ConvertToActive: function() {
        this.Div.removeEvents();
        this.Active = true;
        this.Text = "NEW UNIT\nNEW UNIT\nNEW UNIT\nNEW UNIT\nNEW UNIT\nNEW UNIT\n";
        this.Entities = "";
        this.Div.getElements('.add_unit').dispose();
        Array.each(this.Div.getElements('.unit_activated'), function (child, index) {
            child.set({
                styles: {
                    display: 'block'
                }
            });
        });
        this.Div.removeClass('unit_inactive');
        //this.Div.setProperty('class', 'unit clear_all');
        this.TextDiv.value = this.Text;
        //jQuery(this.TextDiv).elastic();
    },

    OnSplit: function() {
        console.log('on Split');
        debugger;
        if (this.Steps.length > 1) {
            alert("Only units with length of one can be split.\nTry shrinking it (-) instead.");
        } else {
            var newUnit = new Unit(units.length, this.LocationKey, this.Steps.getLast(), [], "Split Unit", true);
            this.Steps.erase(this.Steps.getLast());
            units.splice(units.indexOf(this) + 1, 0, newUnit);

            /* inform steps of change */
            var terminalStep = GetStepFromKey(this.GetLastStepKey());

        }
    },
    OnClose: function() {
        console.log('on Close');
    },
    OnShrink: function() {
        console.log('on Shrink');
        if (this.Steps.length <= 1) {
            alert("Only units with length of more than one can be shrunk.\nIf you want to make a new unit, try spliting it (÷) instead.");
        } else {
            /*Create Empty Unit*/
            var emptyUnit = new Unit(units.length, this.LocationKey, [this.Steps.getLast()], [], "", false);
            emptyUnit.CreateUnitHTML();
            emptyUnit.Div.inject(this.Div, 'after');
            this.Div.setStyle('height', null);

            /* Add to model */
            units.splice(units.indexOf(this) + 1, 0, emptyUnit);

            /* Add to view */
            var emptyUnitStep = GetStepFromKey(emptyUnit.GetLastStepKey());
            emptyUnitStep.LocationUnitHash[this.LocationKey] = emptyUnit;
            emptyUnitStep.UnitTerminals.erase(this);
            emptyUnitStep.UnitTerminals.push(emptyUnit);

            /*Update Current Unit*/
            this.Steps.erase(this.Steps.getLast());
            var terminalStep = GetStepFromKey(this.GetLastStepKey());
            terminalStep.UnitTerminals.push(this);

            Refresh();
        }
    },
    OnGrow: function() {
        console.log('on Grow');
        var terminalStep = GetStepFromKey(this.GetLastStepKey());
        var nextStep = terminalStep.NextStep;
        if (nextStep.RequestGrowth(this)) {
            terminalStep.RemoveUnitTerminal(this);
            this.Steps.push(nextStep.Key);

            /* Hack - because step stamps are for when the step beings,
             * but our logic is from when the step terminates,
             * copy across the stamp here to make it look like it's the other one */
            nextStep.SetStamp(terminalStep.Stamp);
        }
        Refresh();
    }
});
