/* global goog, obacht, io, console */
/* jshint devel: true, strict: false */
goog.provide('obacht.MultiplayerService');

goog.require('goog.pubsub.PubSub');

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

    // Event Publisher/Subscriber (http://closure-library.googlecode.com/svn/docs/class_goog_pubsub_PubSub.html)
    this.events = new goog.pubsub.PubSub();


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
            if (data.players.length === 0) {
                // if normal room has no players yet
                console.log('Joined Room #' + data.pin);
                self.joinRoom(data.pin, data.closed);
                self.events.publish('join_room');
            } else if (data.players[0] === self.pid) {
                // if room has only first player within
                console.log('Wait for other Player.');
                self.playerReady();
                self.events.publish('player_ready');
            }
            self.room = data.pin;
        }
    });

    this.socket.on('room_invite', function (data) {
        if (data.pin === 0) {
            console.log('Create new Room.');
            self.newRoom(data.theme, data.options, data.closed);
            self.events.publish('new_room');
        } else {
            console.log('Joining Room ' + data.pin + ' .');
            self.joinRoom(data.pin, false);
            self.events.publish('join_room');
        }
    });

    this.socket.on('no_match_found', function () {
        console.log('No Match found.');
        this.newRoom();
        self.events.publish('no_match_found');
    });

    this.socket.on('game_ready', function () {
        console.log('Game is ready!');
        self.events.publish('game_ready');
    });

    this.socket.on('player_move', function (data) {
        self.events.publish('player_move', data);
    });

    this.socket.on('player_action', function (data) {
        console.log('player_action: ' + data.type);
        self.events.publish('player_action', data.type, data.data);
    });

    this.socket.on('player_status', function (data) {
        self.events.publish('player_status', data.pid, data.life);
        if (data.life === 0){
            console.log('Game finished!');
        } else {
            console.log('>> playerStatus(' + data.life + ')');
        }
    });

    this.socket.on('item', function (data) {
        console.log('Item Data received');
        console.dir(data);
        self.events.publish('item', data);
    });

    this.socket.on('trap', function (data) {
        console.log('Trap Data received');
        console.dir(data);
        self.events.publish('trap', data);
    });

    this.socket.on('player_left', function () {
        console.log('Player has left the Game!');
        self.events.publish('player_left');
    });

    this.socket.on('get_rooms', function (data) {
        console.log('Getting Rooms Data (Debugging)');
        console.dir(data);
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

obacht.MultiplayerService.prototype.playerReady = function () {
    console.log('>> playerReady()');
    this.socket.emit('player_ready');
};

obacht.MultiplayerService.prototype.playerAction = function(type, data) {
    this.socket.emit('player_action', {
        type: type,
        data: data
    });
};

obacht.MultiplayerService.prototype.playerStatus = function (pid, life) {
    this.socket.emit('player_status', {
        pid: pid,
        life: life
    });
};

obacht.MultiplayerService.prototype.leaveRoom = function() {
    console.log('>> leaveRoom()');
    this.socket.emit('leave_room');
};

/**
 * Debugging Function
 */
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
