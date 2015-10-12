var CONFLICT_COLOUR = '#FFF5F5';
var NO_CONFLICT_COLOUR = 'white';

var Unit = new Class({

    initialize: function(key, locationKey, steps, entities, text, active) {
        this.Key = key;
        this.LocationKey = locationKey;
        this.Steps = steps;
        this.Entities = entities;
        this.Text = text;
        this.Active = active;
        this._HasConflict = false;
    },

    GetLastStepKey: function() {
        return this.Steps.getLast();
    },

    RemoveStep: function(stepKey) {
        this.Steps.erase(stepKey);
    },

    InsertStepAfter: function(newKey, prevKey) {
        this.Steps.splice(this.Steps.indexOf(prevKey) + 1, 0, newKey);
    },

    GetBottomY: function() {
        return this.Div.getPosition().y + this.Div.getScrollSize().y;
    },

    SetBottomY: function(bottomY) {
        var height = bottomY - this.Div.getPosition().y;
        this.Div.setStyle('height', height + 'px');
    },

    CreateUnitHTML: function() {
        this.CreateActive();
        if (!this.Active) {
            this.MakeInactive();
        }
        CheckHeightIncrease();
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
        this.TextDiv.addEvents({
            keyup: function() {
                unit.UpdateEntities(this.value);
            }
        });
        var header = new Element("div", {
            'class': 'unit_header unit_activated'
        });
        var headerDivide = new Element("div", {
            'class': 'unit_divide unit_divide_header'
        });
        var splitButton = new Element("div", {
            html: '&#247;',
            title: 'Split this unit (insert a new step)',
            'class': 'split_unit unit_button'
        });
        splitButton.addEvent('click', function(event){
            event.stop();
            unit.OnSplit();
        });
        var closeButton = new Element("div", {
            html: '&#9679;',
            title: 'Delete this unit',
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
            title: 'Shrink the unit',
            'class': 'shrink_unit unit_button'
        });
        shrinkButton.addEvent('click', function(event){
            event.stop();
            unit.OnShrink();
        });
        var growButton = new Element("div", {
            html: '+',
            title: 'Grow the unit',
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

    },

    MakeInactive: function() {
        this.Active = false;
        this.Text = "";
        this.TextDiv.value = this.Text;
        this.Entities = [];

        Array.each(this.Div.getElements('.unit_activated'), function (child, index) {
            child.set({
                styles: {
                    display: 'none'
                }
            });
        });

        
        if (this._HasConflict) {
            this.RemoveConflict();
            this.CheckForConflicts();
        }

        $(this.Div).css('background', '');

        /*
        var plusDiv = new Element("div", {
            html: '&#9679;',
            'class': 'add_unit'
        });
        this.Div.adopt(plusDiv);
        */
        this.Div.addClass('unit_inactive');

        var unit = this;
        this.Div.addEvent('click', function(event){
            event.stop();
            unit.ConvertToActive();
            Refresh();
        });
    },

    ConvertToActive: function() {
        this.Div.removeEvents();
        this.Active = true;
        this.Text = "New Unit";
        this.Entities = [];
        //this.Div.getElements('.add_unit').dispose();
        Array.each(this.Div.getElements('.unit_activated'), function (child, index) {
            child.set({
                styles: {
                    display: 'inline-block'
                }
            });
        });
        this.Div.removeClass('unit_inactive');
        //this.Div.setProperty('class', 'unit clear_all');
        this.TextDiv.value = this.Text;

        jQuery(this.TextDiv).elastic();
        jQuery('.unit_script').trigger('update');

        if (IsTerminalStep(GetStepFromKey(this.GetLastStepKey()))) {
            CreateNewStep();
        }
    },


    OnSplit: function() {
        if (this.Steps.length > 1) {
            alert("Only units with length of one can be split.\nTry shrinking it (-) instead.");
        } else {
            /* Create a new step */
            InsertNewStep(this.Steps[0]);

            /* Shrink the clicked unit */
            this.OnShrink();
        }
    },
    OnClose: function() {
        while (this.Steps.length > 1) {
            this.OnShrink();
        }

        this.MakeInactive();
    },
    OnShrink: function() {
        if (this.Steps.length <= 1) {
            alert("Only units with length of more than one can be shrunk.\nIf you want to make a new unit, try spliting it (÷) instead.");
        } else {
            /*Create Empty Unit*/
            var emptyUnit = new Unit(UNIT_ID++, this.LocationKey, [this.Steps.getLast()], [], "", false);
            emptyUnit.CreateUnitHTML();
            emptyUnit.Div.inject(this.Div, 'after');
            this.Div.setStyle('height', null);

            /* Add to model */
            units.splice(units.indexOf(this) + 1, 0, emptyUnit);

            /* Add to view */
            var emptyUnitStep = GetStepFromKey(emptyUnit.GetLastStepKey());
            emptyUnitStep.LocationUnitDict[this.LocationKey] = emptyUnit;
            emptyUnitStep.UnitTerminals.erase(this);
            emptyUnitStep.UnitTerminals.push(emptyUnit);

            /* Update Conflicts for new unit */
            emptyUnit.CheckForConflicts();

            /*Update Current Unit*/
            this.Steps.erase(this.Steps.getLast());
            var terminalStep = GetStepFromKey(this.GetLastStepKey());
            terminalStep.UnitTerminals.push(this);

            Refresh();
            this.CheckForConflicts();
        }
    },

    OnGrow: function() {
        var terminalStep = GetStepFromKey(this.GetLastStepKey());
        var nextStep = this.GetNextStep();
        if (nextStep == null) alert ("Error, next step is null");

        if (nextStep.RequestGrowth(this)) {
            terminalStep.RemoveUnitTerminal(this);
            this.Steps.push(nextStep.Key);

            if (IsTerminalStep(nextStep)) {
                CreateNewStep();
            }

            Refresh();
            this.CheckForConflicts();
        }
    },

    GetNextStep: function() {
        var stepIndex = steps.indexOf(GetStepFromKey(this.GetLastStepKey()));
        if (stepIndex >= (steps.length - 1)) {
            return null;
        }

        return steps[stepIndex + 1]; 
    },

    UpdateEntities: function(text) {
        var entities = [];
        for (i = 0; i < text.length; i++) {
            var c = text.charAt(i);
            if (c === c.toUpperCase()) {
                var candidate = "";
                for(j = i; j < text.length && IsLegalEntityChar(text[j]); j++) {
                    candidate += text[j];
                    i++;
                }

                var trimmedCandidate = candidate.trim();
                if (trimmedCandidate.length > 1) {
                    var finalCandidate = RemoveTrailingCharacters(trimmedCandidate);
                    entities.push(finalCandidate);
                }
            }
        }

        /*Check for removed entities*/
        var entityChanged = false;
        var unit = this;
        Array.each(this.Entities, function (entity, index) {
            if (!entities.contains(entity)) {
                entityChanged = true;
                unit.Entities.erase(entity);
            }
        });

        /*Add new removed entities*/
        var unit = this;
        Array.each(entities, function (entity, index) {
            if (!unit.Entities.contains(entity)) {
                entityChanged = true;
                unit.Entities.push(entity);
            }
        });

        if (entityChanged) {
            this.CheckForConflicts();
        }
    },

    CheckForConflicts: function() {
        Array.each(this.Steps, function(stepKey, index) {
            GetStepFromKey(stepKey).CheckEntityConflict();
        });
    },

    AddConflict: function(text) {
        if (!this.Active || this._HasConflict) return;
        this.SetColourScheme('black', 'white');
        this.Div.addClass('has_conflict');
        this.SetConflictSpans(text);
        this._HasConflict = true;
    },

    SetConflictSpans: function(text) {
        //TODO
    },

    RemoveConflict: function(text) {
        if (!this._HasConflict) return;

        //NOTE: Must check if other steps agree no conflict
        unit = this;
        var hasConflict = false;
        if (this.Steps.length > 1) {
            Array.each(this.Steps, function(stepKey, index) {
                if (GetStepFromKey(stepKey).UnitHasConflict(unit)) {
                    hasConflict = true;
                    return;
                };
            });
        }

        if (hasConflict) return;
        this.Div.removeClass('has_conflict');
        this.SetColourScheme('white', 'black');
        this._HasConflict = false;
    },

    SetColourScheme: function(backColour, frontColour) {
        this.Div.set('styles', {
            background: backColour
        });
        this.TextDiv.set('styles', {
            color: frontColour
        });
        Array.each(this.Div.getElementsByClassName('unit_divide'), function(e, index) {
            e.set('styles', {
                background: frontColour
            });
        });
        Array.each(this.Div.getElementsByClassName('unit_button'), function(e, index) {
            e.set('styles', {
                color: frontColour
            });
        });
    }
});
