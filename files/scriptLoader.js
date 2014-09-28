var JSON_FILE = "json";
var SYNCTORY_FILE = "synctory";

var locations;
var steps;
var units;

if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
} else {
    alert('The File APIs are not fully supported in this browser.');
}

function handleFileSelect(evt) {
    var file = evt.target.files[0]; // FileList object
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
    reader.onload = (function (theFile) {
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
    LoadUnitsIntoScripts();
    Refresh();
}

function LoadScriptLocations(locationsJSON) {
    locations = [];
    $$('.location').dispose();
    Array.each(locationsJSON, function(locationJSON, index) {
        var location = new Location(
                index,
                locationJSON.name);
        locations.push(location);
        var locationDiv = new Element("div", {
            'class': 'location',
            'id': 'location_' + location.Key
        });
        var titleDiv = new Element("div", {
            text: location.Name,
            'class': 'location_title'
        });
        $(locationDiv).adopt(titleDiv);
        $('locations').adopt(locationDiv);
    });
}

function LoadScriptSteps(stepsJSON) {
    steps = [];
    $$('.step').dispose();
    Array.each(stepsJSON, function(stepJSON, index) {
        var step = new Step(
                index,
                stepJSON.stamp);
        steps.push(step);
        step.Div = new Element("div", {
            'class': 'step',
            'id': 'step_' + step.Key
        });
        var stampDiv = new Element("div", {
            text: step.Stamp,
            'class': 'step_stamp clear_all'
        });
        $(step.Div).adopt(stampDiv);
        $('step_panel').adopt(step.Div);
    });

    var nextStep = null;
    steps.reverse();
    Array.each(steps, function(step, index) {
        step.SetNext(nextStep);
        nextStep = step;
    });
    steps.reverse();
}


function LoadScriptUnits(unitsJSON) {
    units = [];
    Array.each(unitsJSON, function(unitJSON, index) {
        var unit = new Unit(
                index,
                unitJSON.location,
                unitJSON.start_step,
                unitJSON.last_step,
                unitJSON.entities,
                unitJSON.text);
        units.push(unit);
    });
    $$('.unit').dispose();
    Array.each(units, function(unit, index) {
        if ($(GetLocationIDFromKey(unit.LocationKey)) == null) {
            alert('Could not find location with key ' + unit.LocationKey);
            //CreateNewLocation(unit.LocationKey);
        }
        unit.Div = new Element("div", {
            'class': 'unit clear_all',
            'id': 'unit_' + unit.Key
        }); 
        var textDiv = new Element("textarea", {
            text: unit.Text,
            'class': 'unit_script'
        });
        unit.Div.adopt(textDiv);
        $(GetLocationIDFromKey(unit.LocationKey)).adopt(unit.Div);

        jQuery('.unit_script').elastic();
        jQuery('.unit_script').trigger('update');

        //console.log("unit " + index);
        //console.log("div Height " + unit.Div.getScrollSize().y);
        //console.log("GetUnitHeight " + GetUnitHeight(unit.Div, textDiv));
    });
}

function LoadUnitsIntoScripts() {
    Array.each(units, function(unit, index) {
        var stepKey = unit.LastStep;
        var step = GetStepFromKey(stepKey);
        console.log('load ' + step + ' (' + stepKey + ') ' + ' with unit ' + unit.Key);
        if (step != null) {
            step.AddUnitTerminal(unit);
        }
    });
}

function Refresh() {
    Array.each(steps, function(step, index) {
        step.Reposition();
    });
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

function GetLocationIDFromKey(key) {
    return 'location_' + key;
}

function GetUnitHeight(container, textarea) {
    var containerPadding = container.getStyle('padding-top').toInt()+container.getStyle('padding-bottom').toInt()+container.getStyle('border-top').toInt()+container.getStyle('border-bottom').toInt();
    var textareaPadding = textarea.getStyle('padding-top').toInt()+textarea.getStyle('padding-bottom').toInt()+textarea.getStyle('border-top').toInt()+textarea.getStyle('border-bottom').toInt();
    var textareaHeight = textarea.getScrollSize().y;
    //console.log("containerPadding " + containerPadding);
    //console.log("textareaPadding " + textareaPadding);
    //console.log("textareaHeight " + textareaHeight);
    return containerPadding + textareaPadding + textareaHeight;
}

document.getElementById('file').addEventListener('change', handleFileSelect, false);
