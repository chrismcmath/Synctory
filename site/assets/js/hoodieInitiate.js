"use strict";
var hoodie  = new Hoodie();

function CheckUser() {
    if(hoodie.account.username){
        document.id('credentials').setStyle('display', 'none');
    }else{
        document.id('credentials').setStyle('display', 'block');
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
        });
}

function OnSignIn() {
    hoodie.account.signIn(GetUsername(), GetPassword())
        .done(function (user) {
            CheckUser();
        })
        .fail(function (user) {
            console.log('OnSignIn fail');
        });
}

function OnSignOut() {
    hoodie.account.signOut().done(function (user) {
        CheckUser();
    });
}

hoodie.account.on('authenticated', function (user) {console.log("authenticated");});
hoodie.account.on('signup', function (user) {console.log("signup");});
hoodie.account.on('changeusername', function (user) {console.log("changeusername");});
hoodie.account.on('signin', function (user) {console.log("signin");});
hoodie.account.on('reauthenticated', function (user) {console.log("reauthenticated");});
hoodie.account.on('signout', function (user) {console.log("signout");});
hoodie.account.on('unauthenticated', function (user) {console.log("unauthenticated");});

