document.getElementById('file').addEventListener('change', HandleFileSelect, false);

window.addEvent('domready', function() {
    steps = [];
    locations = [];
    units = [];
    STEP_ID = 0;
    LOCATION_ID = 0;
    UNIT_ID = 0;

    LoadDefaultView();
});

function HandleFileSelect(evt) {
    LoadFile(evt.target.files[0]); // FileList object
}   

function OnLoadComplete() {
    Refresh();
}

function Refresh() {
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

function OnSaveClicked() {
    SaveFile();
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

function UpdateKeyGenerator(generatorID, keyString) {
    /* Make sure our key creator doesn't overwrite any old key */ 
    var intKey = parseInt(keyString);
    if (intKey > generatorID) {
        generatorID = intKey + 1;
    }
}

function LoadLocation(key, name) {
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
    $(titleColumnDiv).adopt(titleDiv);
    $(locationDiv).adopt(titleColumnDiv);
    $('locations').adopt(locationDiv);
}

function LoadStep(key, stamp) {
    var step = new Step(key, stamp);
    steps.push(step);
    step.CreateDiv();
    $('step_panel').adopt(step.Div);
}

// NOTE: Ideally this would be done straight from a json file
//       but having problem with File/Blob so hardcoding for now
function LoadDefaultView() {
    LoadStep('0', 'This is a step.\nIt measures an arbitrary amount of time.\n Everything on this row is happening simultenously.\nClick to rename it.');
    LoadStep('1', '00:01:34 \n "The clock strikes eleven"');
    LoadLocation('0', 'CLICK TO NAME LOCATION');
    LoadScriptUnits(new Object(
                [{
        active: true,
        location: "0",
        steps: [0],
        entities: [
        "A CHARACTER",
        "ANOTHER CHARACTER"
        ],
        text: "Here are your stage directions.\n\nA CHARACTER\nYou can click here to edit\n\nANOTHER CHARACTER\nThat's right. Everything in caps is an 'entity', and can't be used anywhere else in this step!\n\nA CHARACTER\nClick the circle below to make a new unit, or the circle to the right to make a new locaiton."
    },{
        active: false,
        location: "0",
        steps: [1],
        entities: [],
        text: ""
    }]));
    LoadUnitsIntoScripts();
    OnLoadComplete();
}
