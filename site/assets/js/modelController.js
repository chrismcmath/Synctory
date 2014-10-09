document.getElementById('file').addEventListener('change', HandleFileSelect, false);

window.addEvent('domready', function() {
    steps = [];
    locations = [];
    units = [];

    STEP_ID = 0;
    LOCATION_ID = 0;
    UNIT_ID = 0;

    LoadDefaultView();

    //debug
    document.id('credentials').setStyle('display', 'none');
});

function HandleFileSelect(evt) {
    LoadFile(evt.target.files[0]); // FileList object
}   

function OnLoadComplete() {
    Refresh();
}

function OnOverlayClicked() {
    console.log('OnOverlayClicked');
}

function Refresh() {
    Array.each(units, function(unit, index) {
        unit.Div.setStyle('height', null);
    });

    Array.each(steps, function(step, index) {
        step.Reposition();
    });
}

/* TODO: Need a 'iterate from index' func
function RefreshFrom(step_key) {
    if (steps == null) return;
}
*/

function OnLoadClicked() {
    console.log("OnLoadClicked()");
    document.getElementById('file').click();
}

function OnOpenClicked() {
    console.log("OnOpenClicked()");
}

function OnPrintClicked() {
    console.log("OnPrintClicked()");
}

// Unused
function OnSaveClicked() {
    //SaveFile();
}

function OnNewLocation() {
    LoadLocation(LOCATION_ID++, 'NEW LOCATION');
    steps.each(function(step, index) {
        var unit = LoadUnit(UNIT_ID++, locations.getLast().Key, [step.Key], [], "", false);
        LoadUnitIntoSteps(unit);
    });
    Refresh();
}

function OnTextareaHeightChanged() {
    //TODO: Make this only from the changed one
    Refresh();
}

function InsertNewStep(prevStepKey) {

    /* Create new step */
    console.log('CreateNewStep with id' + STEP_ID);
    var newStep = new Step(STEP_ID++, "NEW STEP");
    newStep.CreateDiv();

    /* Inject in model and view */
    var prevStep = GetStepFromKey(prevStepKey);
    newStep.Div.inject(prevStep.Div, 'after');
    steps.splice(steps.indexOf(GetStepFromKey(prevStepKey)) + 1, 0, newStep);

    /* Load that new step with all the previous steps steps and terminals. */
    /* copy hash*/
    prevStep.LocationUnitHash.each(function(unit, location) {
        newStep.LocationUnitHash[location] = unit;
        /* Update unit*/
        unit.InsertStepAfter(newStep.Key, prevStep.Key);
    });

    /* move terminals to new step*/
    prevStep.UnitTerminals.each(function(unit, index) {
        newStep.UnitTerminals.push(unit);
    });
    prevStep.UnitTerminals.empty();
}

function CreateNewStep() {
    var step = LoadStep(STEP_ID++, 'New Step');
    locations.each(function(location, index) {
        var unit = LoadUnit(UNIT_ID++, location.Key, [step.Key], [], "", false);
        LoadUnitIntoSteps(unit);
    });
    Refresh();
}

function IsTerminalStep(step) {
    return steps.indexOf(step) == steps.length - 1;
}

function UpdateKeyGenerator(generatorID, keyString) {
    /* Make sure our key creator doesn't overwrite any old key */ 
    var intKey = parseInt(keyString);
    if (intKey >= generatorID) {
        return intKey + 1;
    }
    return generatorID;
}

function LoadLocation(key, name) {
    LOCATION_ID = UpdateKeyGenerator(LOCATION_ID, key);
    var location = new Location(key, name);
    locations.push(location);
    var locationDiv = new Element("div", {
        'class': 'location',
        'id': 'location_' + location.Key
    });
    var titleColumnDiv = new Element("div", {
        'class': 'location_title_column'
    });
    var titleDiv = new Element("div", {
        html:'<p>'+location.Name+'</p>',
        'class': 'location_title'
    });
    document.id(titleColumnDiv).adopt(titleDiv);
    document.id(locationDiv).adopt(titleColumnDiv);
    document.id('locations').adopt(locationDiv);
    locationDiv.inject(document.id('new_location'), 'before');
}

function LoadStep(key, stamp) {
    STEP_ID = UpdateKeyGenerator(STEP_ID, key);
    var step = new Step(key, stamp);
    steps.push(step);
    step.CreateDiv();
    document.id('step_panel').adopt(step.Div);
    return step;
}

function LoadUnit(key, location, steps, entities, text, active) {
    UNIT_ID = UpdateKeyGenerator(UNIT_ID, key);
    var unit = new Unit(key, location, steps, entities, text, active);
    units.push(unit);

    unit.CreateUnitHTML();
    document.id(GetLocationIDFromKey(unit.LocationKey)).adopt(unit.Div);

    jQuery(unit.TextDiv).elastic();
    jQuery('.unit_script').trigger('update');

    return unit;
}

// NOTE: Ideally this would be done straight from a json file
//       but having problem with File/Blob so hardcoding for now
function LoadDefaultView() {
    LoadStep('0', 'This is a step.\nIt measures an arbitrary amount of time.\n Everything on this row is happening simultenously.\nClick to rename it.');
    LoadStep('1', '00:01:34 \n "The clock strikes eleven"');
    LoadLocation('0', 'CLICK TO NAME LOCATION');
    LoadUnit('0', '0', ['0'], ["A CHARACTER", "ANOTHER CHARACTER"],
        "Here are your stage directions.\n\nA CHARACTER\nYou can click here to edit\n\nANOTHER CHARACTER\nThat's right. Everything in caps is an 'entity', and can't be used anywhere else in this step!\n\nA CHARACTER\nClick the circle below to make a new unit, or the circle to the right to make a new location.",
        true);
    LoadUnit('1', '0', ['1'], [], "", false);
    LoadUnitsIntoSteps();
    OnLoadComplete();
}

function IsLegalEntityChar(c) {
    var bool = (c.length === 1 && c.test(/[A-Z]/) || c === " ");
    //console.log('IsLegalEntityChar letter: ' + c + ' result: ' + bool);
    return bool;
}
