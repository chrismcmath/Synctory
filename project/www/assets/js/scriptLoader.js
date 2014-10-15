var JSON_FILE = "json";
var SYNCTORY_FILE = "synctory";

if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
} else {
    alert('The File APIs are not fully supported in this browser.');
}

function LoadFile(file) {
    var split_parts = file.name.split(".");
    /*
    console.log(" got " + file +
            "name: " + file.name +
            "type: " + file.type +
            "size: " + file.size +
            "beg: " + split_parts[0] +
            "end: " + split_parts[split_parts.length -1]);
            */

    var file_type = split_parts[split_parts.length -1];
    if (!(file_type.toLowerCase() == SYNCTORY_FILE || file_type.toLowerCase() == JSON_FILE)) {
        alert("Please choose a .synctory (or JSON) file");
        return;
    }

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function (f) {
        return function (e) { 
            JsonObj = e.target.result
            //console.log(JsonObj);
            var script = JSON.parse(JsonObj);
            LoadScript(script);
        };
    })(file);

    reader.readAsText(file, 'UTF-8');
}

function LoadScript(script) {
    var locationsJSON = script.locations;
    LoadScriptLocations(locationsJSON);
    var stepsJSON = script.steps;
    LoadScriptSteps(stepsJSON);
    var unitsJSON = script.units;
    LoadScriptUnits(unitsJSON);
    LoadUnitsIntoSteps();
    CheckConflicts();
    OnLoadComplete();
}

function LoadScriptLocations(locationsJSON) {
    locations = [];
    $$('.location').dispose();
    Array.each(locationsJSON, function(locationJSON, index) {
        LoadLocation(locationJSON.key, locationJSON.name);
    });
}

function LoadScriptSteps(stepsJSON) {
    steps = [];
    $$('.step').dispose();
    Array.each(stepsJSON, function(stepJSON, index) {
        LoadStep(stepJSON.key, stepJSON.stamp);
    });

    /*
    var nextStep = null;
    steps.reverse();
    Array.each(steps, function(step, index) {
        step.SetNext(nextStep);
        nextStep = step;
    });
    steps.reverse();
    */
}


function LoadScriptUnits(unitsJSON) {
    units = [];
    Array.each(unitsJSON, function(unitJSON, index) {
        LoadUnit(unitJSON.key,
                unitJSON.location,
                unitJSON.steps,
                unitJSON.entities,
                unitJSON.text,
                unitJSON.active);
    });
    //$$('.unit').dispose();
}

function LoadUnitsIntoSteps() {
    Array.each(units, function(unit, index) {
        LoadUnitIntoSteps(unit);
    });
}

function CheckConflicts() {
    Array.each(steps, function(step, index) {
        step.CheckEntityConflict();
    });
}

function LoadUnitIntoSteps(unit) {
    Array.each(unit.Steps, function(stepKey, index) {
        var step = GetStepFromKey(stepKey);
        //console.log('load ' + step + ' (' + stepKey + ') ' + ' with unit ' + unit.Key);
        if (step != null) {
            step.AddUnit(unit);
        }
    });
    var terminalStepKey = unit.GetLastStepKey();
    var lastStep = GetStepFromKey(terminalStepKey);
    if (lastStep != null) {
        lastStep.AddUnitTerminal(unit);
    }
}

function ExportSynctoryFile() {
    jsonString = JSON.encode(GetSaveObject());
    var jsonBlob = new Blob([jsonString], {type: "text/plain;charset=utf-8"});
    saveAs(jsonBlob, title + ".synctory");
}

function GetSaveObject() {
    var jObj = {};
    jObj.title = title;
    jObj.author = author;
    jObj.locations = GetLocationJSON();
    jObj.steps = GetStepJSON();
    jObj.units = GetUnitJSON();

    return jObj;
}

function GetLocationJSON() {
    var locationJSON = [];
    Array.each(locations, function(location, index) {
        var l = {};
        l.key = location.Key;
        l.name = location.Name;
        locationJSON.push(l);
    });
    return locationJSON;
}

function GetStepJSON() {
    var stepJSON = [];
    Array.each(steps, function(step, index) {
        var s = {};
        s.key = step.Key;
        s.stamp = step.Stamp;
        stepJSON.push(s);
    });
    return stepJSON;
}

function GetUnitJSON() {
    var unitJSON = [];
    Array.each(steps, function(step, index) {
        Array.each(step.UnitTerminals, function(unit, index) {
            var u = {};
            u.key = unit.Key;
            u.location = unit.LocationKey;
            u.steps = unit.Steps;
            u.entities = unit.Entities;
            u.text = unit.TextDiv.value;
            u.active = unit.Active;
            unitJSON.push(u);
        });
    });
    return unitJSON;
}

/* Utils */
function GetLocationFromKey(locationKey) {
    var returnLocation = null;
    locations.some(function(location) {
        if (location.Key == locationKey) {
            returnLocation = location;
            return true;
        } else {
            return false;
        }
    });
    return returnLocation;
}

function GetCurrentLocationName(key) {
    return GetLocationFromKey(key).Name;
}

function GetStepFromKey(stepKey) {
    var returnStep = null;
    steps.some(function(step) {
        if (step.Key == stepKey) {
            returnStep = step;
            return true;
        } else {
            return false;
        }
    });
    return returnStep;
}

function GetCurrentStepStamp(key) {
    return GetStepFromKey(key).Stamp;
}

function GetLocationIDFromKey(key) {
    return 'location_' + key;
}

