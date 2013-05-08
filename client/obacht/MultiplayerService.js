/* global goog, obacht, io, console */
/* jshint devel: true, strict: false */
goog.provide('obacht.MultiplayerService');

/**
 * This service handles the connection between client and a mulitplayer-server
 *
 * It includes the communication protocol and registers functions and events
 * Uses Socket.io and connects to a Node.js Server
 *
 * @author Simon Heimler
 * @author Sebastian Huber
 */

obacht.MultiplayerService = function(serverUrl) {

    //////////////////////////////
    // Model                    //
    //////////////////////////////

    this.serverUrl = serverUrl;
    this.room = false;
    this.pid = undefined;
    this.socket = io.connect(this.serverUrl); // Set up Socket-Connection to Server

    var self = this;

    console.log("Connecting to Multiplayer Server on " + serverUrl);


    //////////////////////////////
    // Communication Events     //
    //////////////////////////////

    this.socket.on('connected', function (data) {
        if (!data.error) {
            console.log('Successful Connected');
            self.pid = data.pid;
        } else {
            console.log(data.error);
        }
    });

    this.socket.on('room_detail', function (data) {
        console.dir(data);
        if (data.error) {
            // e.g. no free place in room
            console.log(data.error);
        } else {
            // if no errors
            if (data.players.length === 0 && data.pin === 0) {
                // if random room has no players yet
                console.log('Created new Room');
                console.log(data.closed);
                self.newRoom(data.theme, data.options, data.closed);
            } else if (data.players.length === 0) {
                // if normal room has no players yet
                console.log('Joined Room #' + data.pin);
                self.joinRoom(data.pin, data.closed);
            } else if (data.players[0] === self.pid) {
                // if room has only first player within
                console.log('Wait for other Player.');
            } else if (data.players.length === 1) {
                // if room has room for one more player
                console.log('Joining Room.');
                self.joinRoom(data.pin);
            }  
            self.room = data.pin;   
        }
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

    this.socket.on('trap', function (data) {
        console.log('Trap Data received');
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

obacht.MultiplayerService.prototype.newRoom = function (theme, options, closed) {
    console.log('>> newRoom()');
    this.socket.emit('new_room', {
        theme: theme,
        options: options,
        closed: closed
    });
};

obacht.MultiplayerService.prototype.joinRoom = function(pin, closed) {
    console.log('>> joinRoom(' + pin + ')');
    this.socket.emit('join_room', {
        pin: pin,
        closed: closed
    });
};

obacht.MultiplayerService.prototype.findMatch = function () {
    console.log('>> findMatch()');
    this.socket.emit('find_match');
};

obacht.MultiplayerService.prototype.playerAction = function(type, data) {
    this.socket.emit('player_action', {
        type: type,
        data: data
    });
};




obacht.MultiplayerService.prototype.leaveRoom = function() {
    console.log('>> leaveRoom()');
    this.socket.emit('leave_room');
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
