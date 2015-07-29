/**
 * Created by pverbrugge on 29/07/15.
 */
"use strict";

/* Setup key events */
var keyStates = [];
for(var i = 0; i < 200; i++) {
    keyStates.push({state : false, time : 0});
}

var keyDownHandler = function(event) {
    event.preventDefault();
    var keyCode = event.which;
    var time = new Date();
    keyStates[keyCode] = {state : true, time : time.getTime()};

    //console.log("Keyboard button " + keyCode + " pressed : " + time.toLocaleTimeString());
}

var keyUpHandler = function(event) {
    event.preventDefault();
    var keyCode = event.which;
    var time = new Date();
    keyStates[keyCode] = {state : false, time : time.getTime()};

    //console.log("Keyboard button " + keyCode + " released : " + time.toLocaleTimeString());
}

/* Setup mouse events */
var mousePosition = {x : 0, y : 0};
var mouseMoveCallbacks = [];
var mouseMoveHandler = function() {
    event.preventDefault();
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (event.clientY / window.innerHeight) * 2 + 1;

    mouseMoveCallbacks.forEach(function(callback) {
        callback(mousePosition);
    });
    //console.log("Mouse moved to " + mousePosition.x + "," + mousePosition.y);
}

var registerOnMouseMove = function(callback) {
    mouseMoveCallbacks.push(callback);
}


var buttonStates = [];
for(var i = 0; i < 3; i++) {
    buttonStates.push({state : false, time : 0});
}

var mouseDownCallbacks = [];
var mouseDownHandler = function(event) {
    event.preventDefault();
    var buttonCode = event.button;
    var time = new Date();
    buttonStates[buttonCode] = {state : true, time : time.getTime()};
    /*
     console.log("Mouse button " + buttonCode +
     " pressed at " + mousePosition.x.toFixed(2) + "," + mousePosition.y.toFixed(2) +
     ": " + time.toLocaleTimeString());
     */
    mouseDownCallbacks.forEach(function(callback) {
        callback(mousePosition, buttonCode);
    });
}

var registerOnMouseDown = function(callback) {
    mouseDownCallbacks.push(callback);
}

var mouseUpCallbacks = [];
var mouseUpHandler = function(event) {
    event.preventDefault();
    var buttonCode = event.button;
    var time = new Date();
    buttonStates[buttonCode] = {state : false, time : time.getTime()};
    /*
     console.log("Mouse button " + buttonCode +
     " released at " + mousePosition.x.toFixed(2) + "," + mousePosition.y.toFixed(2) +
     ": " + time.toLocaleTimeString());
     */
    mouseUpCallbacks.forEach(function(callback) {
        callback(mousePosition, buttonCode);
    });
}

var registerOnMouseUp = function(callback) {
    mouseUpCallbacks.push(callback);
}