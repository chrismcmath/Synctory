"use strict";
var hoodie  = new Hoodie();
var SCRIPT_TYPE  = "script";

function CheckUser() {
    if (hoodie.account.username){
        DisplayMyScripts();
    } else {
        ShowCredentials();
    }
}

function GetUsername() {
    return document.id('credentials').getElements('input[name=username]')[0].value;
}

function GetPassword() {
    return document.id('credentials').getElements('input[name=password]')[0].value;
}

function OnSignUp() {
    hoodie.account.signUp(GetUsername(), GetPassword())
        .done(function (user) {
            CheckUser();
        })
        .fail(function (user) {
            console.log('OnSignUp fail');
            DisplayErrorMsg(["User already exists","Please choose a new name or Sign In"]);
        });
}

function OnSignIn() {
    hoodie.account.signIn(GetUsername(), GetPassword())
        .done(function (user) {
            CheckUser();
        })
        .fail(function (user) {
            console.log('OnSignIn fail');
            DisplayErrorMsg(["Sign in error","Please check your username/password"]);
        });
}

function OnSignOut() {
    hoodie.account.signOut().done(function (user) {
        ResetScript();
        CheckUser();
    });
}

function GetUserScripts(callback) {
    hoodie.store.findAll(function(object){
        if(object.type === SCRIPT_TYPE){
            return true;
        }
    }).done(callback);
}

function NewScript(title, author) {
    var attributes = {title: title, author: author};
    hoodie.store.add(SCRIPT_TYPE, attributes)
        .done(function (newScript) {
            SetCurrentScript(newScript);
            OnNewScriptCreated();
        });
}

function SaveScript(script) {
    console.log("about to save");
    hoodie.store.update(SCRIPT_TYPE, CurrentScriptID, script)
        .done(function (savedScript) {
            OnScriptSaved();
        });
}


hoodie.account.on('authenticated', function (user) {console.log("authenticated");});
hoodie.account.on('signup', function (user) {console.log("signup");});
hoodie.account.on('changeusername', function (user) {console.log("changeusername");});
hoodie.account.on('signin', function (user) {console.log("signin");});
hoodie.account.on('reauthenticated', function (user) {console.log("reauthenticated");});
hoodie.account.on('signout', function (user) {console.log("signout");});
hoodie.account.on('unauthenticated', function (user) {console.log("unauthenticated");});

