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
            var parsedJSON = JSON.parse(JsonObj);
            LoadScript(parsedJSON);
        };
    })(file);

    reader.readAsText(file, 'UTF-8');
}

function LoadScript(parsedJSON) {
    var locationsJSON = parsedJSON.locations;
    LoadScriptLocations(locationsJSON);
    var stepsJSON = parsedJSON.steps;
    LoadScriptSteps(stepsJSON);
    var unitsJSON = parsedJSON.units;
    LoadScriptUnits(unitsJSON);
    LoadUnitsIntoSteps();
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

function LoadUnitIntoSteps(unit) {
    Array.each(unit.Steps, function(stepKey, index) {
        var step = GetStepFromKey(stepKey);
        console.log('load ' + step + ' (' + stepKey + ') ' + ' with unit ' + unit.Key);
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

function SaveFile() {
    var jObj = {};
    jObj.title = "title";
    jObj.author = "author";
    jObj.locations = GetLocationJSON();
    jObj.steps = GetStepJSON();
    jObj.units = GetUnitJSON();

    var jsonString = JSON.encode(jObj);

    var jsonBlob = new Blob([jsonString], {type: "text/plain;charset=utf-8"});
    saveAs(jsonBlob, "blob_test.synctory");
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
    Array.each(units, function(unit, index) {
        var u = {};
        u.location = unit.LocationKey;
        u.steps = unit.Steps;
        u.entites = unit.Entites;
        u.text = unit.TextDiv.value;
        unitJSON.push(u);
    });
    return unitJSON;
}

/* Utils */

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

function GetLocationIDFromKey(key) {
    return 'location_' + key;
}
