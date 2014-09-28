window.addEvent('domready', function() {
    steps = [];
    locations = [];
    units = [];
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

function RefreshFrom(step_key) {
    if (steps == null) return;
    
    var step = steps[0]; //Assuming first step will always be at [0]
    while (step != null) {
        step.Reposition();
        step = step.NextStep;
    }
}

function OnSaveClicked() {
    SaveFile();
}

function OnTextareaHeightChanged() {
    //TODO: Make this only from the changed one
    Refresh();
}

document.getElementById('file').addEventListener('change', HandleFileSelect, false);
