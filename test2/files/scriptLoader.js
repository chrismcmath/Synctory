var JSON_FILE = "json";
var SYNCTORY_FILE = "synctory";

if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
} else {
    alert('The File APIs are not fully supported in this browser.');
}

function handleFileSelect(evt) {
    var file = evt.target.files[0]; // FileList object
    var split_parts = file.name.split(".");
    console.log(" got " + file +
            "name: " + file.name +
            "type: " + file.type +
            "size: " + file.size +
            "beg: " + split_parts[0] +
            "end: " + split_parts[split_parts.length -1]);

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
            console.log(JsonObj);
            var parsedJSON = JSON.parse(JsonObj);
            LoadScript(parsedJSON);
        };
    })(file);

    reader.readAsText(file, 'UTF-8');
}

function LoadScript(parsedJSON) {
    var locationsJSON = parsedJSON.locations;
    LoadScriptLocations(locationsJSON);
    var unitsJSON = parsedJSON.units;
    LoadScriptUnits(unitsJSON);
    var stepsJSON = parsedJSON.steps;
    LoadScriptSteps(stepsJSON);
}

function LoadScriptLocations(locationsJSON) {
    var locations = []
    $$('.location').dispose();
    Array.each(locationsJSON, function(locationJSON, index) {
        var location = new Location(
                index,
                locationJSON.name);
        locations.push(location);
        var locationDiv  = new Element("div", {
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

function LoadScriptUnits(unitsJSON) {
    var units = []
    Array.each(unitsJSON, function(unitJSON, index) {
        var unit = new Unit(
                index,
                unitJSON.location,
                unitJSON.start_step,
                unitJSON.length,
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
        var unitDiv  = new Element("div", {
            'class': 'unit',
            'id': 'unit_' + unit.Key
        }); 
        var textDiv = new Element("textarea", {
            text: unit.Text,
            'class': 'flext growme'
        });
        unitDiv.adopt(textDiv);
        $(GetLocationIDFromKey(unit.LocationKey)).adopt(unitDiv);
        var flext = new Flext(textDiv); 

        console.log("unit " + index + " height: " +  unitDiv.getScrollSize().y);
    });
}

function LoadScriptSteps(stepsJSON) {
}

function GetLocationIDFromKey(key) {
    return 'location_' + key;
}

document.getElementById('file').addEventListener('change', handleFileSelect, false);
