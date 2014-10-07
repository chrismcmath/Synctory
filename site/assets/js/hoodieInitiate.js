"use strict";
var hoodie  = new Hoodie();

function CheckUser() {
    if(hoodie.account.username){
        $('credentials').setStyle('display', 'none');
    }else{
        $('credentials').setStyle('display', 'block');
    }
}

function GetUsername() {
    return $('credentials').getElements('input[name=username]')[0].value;
}

function GetPassword() {
    return $('credentials').getElements('input[name=password]')[0].value;
}

function OnSignUp() {
    hoodie.account.signUp(GetUsername(), GetPassword()).done(function (user) {
        CheckUser();
    });
}

function OnSignIn() {
    hoodie.account.signIn(GetUsername(), GetPassword()).done(function (user) {
        CheckUser();
    });
}

function OnSignOut() {
    hoodie.account.signOut().done(function (user) {
        CheckUser();
    });
}
