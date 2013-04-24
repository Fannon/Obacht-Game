/* global goog, obacht, io, console */
/* jshint devel: true, strict: false */
goog.provide('obacht.MultiplayerService');

/**
 * This service handles the connection between client and a mulitplayer-server
 *
 * It includes the communication protocol and registers functions and events
 * Uses Socket.io and connects to a Node.js Server
 *
 * @singleton
 * @author Simon Heimler
 */

// TODO: Singleton Pattern: http://addyosmani.com/resources/essentialjsdesignpatterns/book/#singletonpatternjavascript

obacht.MultiplayerService = function(serverUrl) {

    //////////////////////////////
    // Model                    //
    //////////////////////////////

    this.serverUrl = serverUrl;
    this.room = false;
    this.socket = io.connect(this.serverUrl); // Set up Socket-Connection to Server

    var self = this;


    //////////////////////////////
    // Communication Events     //
    //////////////////////////////

    this.socket.on('connected', function (success) {
        if (success === true) {
            console.log('Successful Connected');
        }
    });

    this.socket.on('room_pin', function (pin) {
        if (pin) {
            that.room = pin;
            console.log('Joined Room #' + pin);
        } else {
            console.log('Could not join room, maybe it is full.');
        }
    });

    this.socket.on('new_room_pin', function (pin) {
        console.log('New PIN received: ' + pin);
        this.joinRoom(pin);
    });

    this.socket.on('no_match_found', function () {
        console.log('No Match found.');
        this.newRoom();
    });

    this.socket.on('player_move', function (data) {
        console.log('Enemy Movement Data received');
        console.dir(data);
    });

    this.socket.on('item', function (data) {
        console.log('Item Data received');
        console.dir(data);
    });

    this.socket.on('hurdle', function (data) {
        console.log('Hurdle Data received');
        console.dir(data);
    });

    this.socket.on('get_rooms', function (data) {
        for (var roomId in data) {
            if (roomId !== "") {
                console.log('Room #' + roomId + ', Users: ' + data[roomId]);
            }
        }
    });

};


//////////////////////////////
// Communication Functions  //
//////////////////////////////

obacht.MultiplayerService.prototype.findMatch = function () {
    console.log('>> findMatch()');
    this.socket.emit('find_match');
};

obacht.MultiplayerService.prototype.newRoom = function () {
    console.log('>> newRoom()');
    this.socket.emit('new_room');
};

obacht.MultiplayerService.prototype.joinRoom = function(pin, privateRoom) {
    if (privateRoom) {
        pin = 'P' + pin;
    }
    console.log('>> joinRoom(' + pin + ')');
    this.socket.emit('join_room', pin);
};

obacht.MultiplayerService.prototype.leaveRoom = function() {
    console.log('>> leaveRoom()');
    this.socket.emit('leave_room');
};

obacht.MultiplayerService.prototype.playerMove = function(data) {
    if (this.room) {
        console.log('>> playerMove()');
        this.socket.emit('player_move', data);
    } else {
        console.log('Not in a room yet!');
    }
};

obacht.MultiplayerService.prototype.throwHurdle = function(data) {
    this.socket.emit('thrown_hurdle', data);
};

obacht.MultiplayerService.prototype.getRooms = function() {
    console.log('>> getRooms()');
    this.socket.emit('get_rooms', '');
};


//////////////////////////////
// Helper Functions         //
//////////////////////////////

// TODO: Maybe not the best solution with Google Closure Library
// http://stackoverflow.com/questions/3313875/javascript-date-ensure-getminutes-gethours-getseconds-puts-0-in-front-i
Number.prototype.pad = function (len) {
    return (new Array(len+1).join("0") + this).slice(-len);
};
