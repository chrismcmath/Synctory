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
            this.CreateActive();
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
        var closeButton = new Element("div", {
            html: '&#9679;',
            'class': 'close_unit unit_button'
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
            html: '+',
            'class': 'shrink_unit unit_button'
        });
        var growButton = new Element("div", {
            html: '-',
            'class': 'grow_unit unit_button'
        });
        footer.adopt(footerDivide);
        footer.adopt(shrinkButton);
        footer.adopt(growButton);
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
            html: '+',
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
    }
});
