var Unit = new Class({
    initialize: function(key, locationKey, startStep, lastStep, entities, text, active) {
        this.Key = key;
        this.LocationKey = locationKey;
        this.StartStep = startStep;
        this.LastStep = lastStep;
        //this.Length = length;
        this.Entities = entities;
        this.Text = text;
        this.Active = active;
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
    },

    CreateUnitHTML: function() {
        if (this.Active) {
            this.CreateActive();
        } else {
            this.CreateInactive();
        }
    },

    CreateActive: function() {
        this.Div = new Element("div", {
            'class': 'unit clear_all',
        'id': 'unit_' + this.Key
        });
        this.TextDiv = new Element("textarea", {
            text: this.Text,
            'class': 'unit_script'
        });
        this.Div.adopt(this.TextDiv);
        $(GetLocationIDFromKey(this.LocationKey)).adopt(this.Div);
    },

    CreateInactive: function() {
        this.Div = new Element("div", {
            'class': 'unit unit_inactive',
        'id': 'unit_' + this.Key
        });
        var plusDiv = new Element("div", {
            html: '+',
            'class': 'add_unit'
        });
        this.TextDiv = new Element("textarea", {
            styles: {
                display: 'none'
            },
            'class': 'unit_script'
        });
        this.Div.adopt(this.TextDiv);
        this.Div.adopt(plusDiv);
        $(GetLocationIDFromKey(this.LocationKey)).adopt(this.Div);

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
        this.Div.empty();
        this.Div.setProperty('class', 'unit clear_all');
        this.TextDiv = new Element("textarea", {
            text: this.Text,
            'class': 'unit_script'
        });
        this.Div.adopt(this.TextDiv);
        jQuery(this.TextDiv).elastic();
    }
});
