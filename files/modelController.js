
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

function OnSaveClicked() {
    SaveFile();
}

document.getElementById('file').addEventListener('change', HandleFileSelect, false);
