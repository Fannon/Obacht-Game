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
    this.pin = false;
    this.pid = false;
    this.roomDetail = false;
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
        self.roomDetail = data;
        self.pin = data.pin;

        console.log('RoomDetails received');
        console.dir(data);
        self.events.publish('room_detail', data);

    });

    this.socket.on('error', function(data) {
        if (data.type === 'warning') {
            console.warn(data.msg);
        } else {
            console.error(data.msg);
        }
        if (data.trace) {
            console.dir(data.trace);
        }
    });

    this.socket.on('message', function(data) {
        console.log('Incoming Message from Server:');
        console.dir(data);
    });

    this.socket.on('room_invite', function (data) {

        console.log('Room invite received: PIN: #' + data.pin);

        if (data.pin === 0) {
            console.log('Create new random Room.');

            var theme = self.getRandomTheme();
            console.log('Random Theme: ' + theme);

            self.newRoom(theme, data.options, false);
            self.events.publish('new_room');

        } else {
            console.log('Joining Room ' + data.pin);
            self.joinRoom(data.pin, data.closed);
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

/**
 * Broadcast Player Action
 *
 * @param  {String} type Type of Player Action, i.e. 'jump'
 * @param  {object} data ActionData
 */
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

obacht.MultiplayerService.prototype.getRandomTheme = function() {
    console.dir(obacht.themes);
    var availableThemes = obacht.themes.availableThemes;
    var rand = Math.floor(availableThemes.length * Math.random());
    return availableThemes[rand];
};
