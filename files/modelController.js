document.getElementById('file').addEventListener('change', HandleFileSelect, false);

window.addEvent('domready', function() {
    steps = [];
    locations = [];
    units = [];
    STEP_ID = 0;
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
