var AUTOSAVE_PERIOD = 30000; //autosave every 30 seconds

document.getElementById('file').addEventListener('change', HandleFileSelect, false);

window.addEvent('domready', function() {
    steps = [];
    locations = [];
    units = [];

    CurrentScriptID = "";

    STEP_ID = 0;
    LOCATION_ID = 0;
    UNIT_ID = 0;


    $('.overlay').click(function( event ) {
        event.stopPropagation();
        HideAllOverlays();
    });
    $('.overlay_background').click(function( event ) {
        event.stopPropagation();
    });
    HideAllOverlays(); // will check if logged in/ script loaded etc
});

window.setInterval(function(){
    if (CurrentScriptID != "") {
        OnSaveScript();
    }
}, AUTOSAVE_PERIOD);
      
function ShowCredentials() {
    $('.overlay').hide();
    $('#credentials').show();
}

function HandleFileSelect(evt) {
    LoadFile(evt.target.files[0]); // FileList object
}   

function HideOverlay() {
    $('.overlay').hide();

    CheckCurrentState();
}

function CheckCurrentState() {
    return CheckLoggedIn() && CheckScriptSelected();
}

function CheckLoggedIn() {
    if (!hoodie.account.username) {
        alert('ERROR: user is not logged in');
        ShowCredentials();
        return false;
    }
    return true;
}

function CheckScriptSelected() {
    if (CurrentScriptID === "") {
        alert('ERROR: script not selected');
        DisplayMyScripts();
        return false;
    }
    return true;
}

function OnNewFileClicked(event) {
    event.stopPropagation()

    // Just a simple switch
    // Can't just HideAllOverlays here- edge case that we might not have a script ID yet
    $('#open_overlay').hide();
    $('#create_overlay').show();
}

function OnCreateNewScript () {
    var title = $('#create_overlay input[name=title]')[0].value;
    var author = $('#create_overlay input[name=author]')[0].value;

    var errorMsgs = new Array();
    if (title === "") {
        errorMsgs.push("Please input a title");
    }
    if (author === "") {
        errorMsgs.push("Please input an author");
    }

    if (errorMsgs.length == 0) {
        NewScript(title, author);
    } else {
        DisplayErrorMsg(errorMsgs);
    }
}

function DisplayErrorMsg(errorMsgs) {
    $('#error_msg').empty();

    Array.each(errorMsgs, function(msg, index) {
        $('<p/>', {
            text: msg
        }).appendTo('#error_msg');
    });

    TweenErrorMsgIn();
}

function TweenErrorMsgIn() {
    $('#error_msg').tween({
        opacity:{
            start: 0,
        stop: 100,
        time: 0,
        duration: 1,
        effect:'easeInOut',
        onStop: function(){
            TweenErrorMsgOut();
        }
        }
    });

    $.play();
}

function TweenErrorMsgOut() {
    $('#error_msg').tween({
        opacity:{
            start: 100,
        stop: 0,
        time: 1,
        duration: 1,
        effect:'easeInOut'
        }
    });

    $.play();
}

function OnCopyFileClicked() {
    console.log('OnCopyFileClicked');
}

function DisplayMyScripts() {
    $('#open_overlay').show();

    if (!CheckLoggedIn()) return;

    $('#script_list li').remove(":not(.permanent)");
    GetUserScripts(function (scripts) {
        var sortedList = sortByKey(scripts, 'updatedAt').reverse();
        Array.each(sortedList, function(script, index) {
            LoadScriptIntoList(script.title, script.updatedAt.split('T')[0], function (evt) {
                CurrentScriptID = script.id;
                LoadScript(script);
                HideAllOverlays();
            });
        });
    });
}

//kudos http://stackoverflow.com/questions/20692010/sort-array-and-get-first-key-in-jquery
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function LoadScriptIntoList(title, date, callback) {
    var listItem = $('<li/>', {
        on: {
            click: callback
        }
    }).appendTo('#script_list');

    $('<span/>', {
        "class": "script_title",
        text: title
    }).appendTo(listItem);
    jQuery('<span/>', {
        "class": "script_date",
        text: date
    }).appendTo(listItem);
}

function HideAllOverlays() {
    $('.overlay').hide();
    CheckCurrentState();
}

function OnLoadComplete() {
    Refresh();
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
    /*
    console.log("OnLoadClicked()");
    document.getElementById('file').click();
    */
}

function OnOpenClicked() {
    DisplayMyScripts();
}

function OnPrintClicked() {
    console.log("OnPrintClicked()");
}

/*
hoodie.remote.on('update', function (updatedObject) {
    console.log('updated to the cloud!')}
    );
    */

function OnNewScriptCreated() {
    LoadDefaultView();
    HideAllOverlays();
}

function OnSaveScript() {
    $('#header_save_icon').text("SAVING...");
    $('#header_save_icon').tween({
        opacity:{
            start: 0,
        stop: 100,
        time: 0,
        duration: 0.2,
        effect:'easeInOut'
        }
    });
    $.play();

    var script = GetSaveObject();
    SaveScript(script);
}

function OnScriptSaved() {
    $('#header_save_icon').text("SAVED");
    $('#header_save_icon').tween({
        opacity:{
            start: 100,
        stop: 0,
        time: 0,
        duration: 1,
        effect:'easeInOut'
        }
    });
    $.play();
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
