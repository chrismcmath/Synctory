var Unit = new Class({
    initialize: function(key, locationKey, startStep, length, entities, text) {
        this.Key = key;
        this.LocationKey = locationKey;
        this.StartStep = startStep;
        this.Length = length;
        this.Entities = entities;
        this.Text = text;
    },

    GetLastStep: function() {
        return this.StartStep + this.Length;
    }
});
