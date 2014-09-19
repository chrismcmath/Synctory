var JSON_FILE = "json";
var SYNCTORY_FILE = "synctory";

if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
} else {
    alert('The File APIs are not fully supported in this browser.');
}

function handleFileSelect(evt) {
    console.log("handleFileSelect " + evt);
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

    /*
    console.log("before onload");
      // Closure to capture the file information.
      reader.onload = (function(theFile) {
            console.log("in result");
            var jsonString = reader.readAsText(theFile);
            debugger;
        return function(e) {
            console.log("result: " + e.target.result);
        };
      })(file);
    console.log("after onload");

    */
        // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e) { 
            JsonObj = e.target.result
            console.log(JsonObj);
            var parsedJSON = JSON.parse(JsonObj);
            debugger;
            //var x = parsedJSON['frames']['chaingun.png']['spriteSourceSize']['x'];
            console.log(parsedJSON);

        };
    })(file);

    reader.readAsText(file, 'UTF-8');

    //var jObject = JSON.Parse(FileReader.readAsText(file


    // files is a FileList of File objects. List some properties.
     /*
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
    */
}

document.getElementById('file').addEventListener('change', handleFileSelect, false);
