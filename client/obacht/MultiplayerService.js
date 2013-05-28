/* global goog, obacht, io, console */
/* jshint devel: true */

goog.provide('obacht.MultiplayerService');

goog.require('goog.pubsub.PubSub');

/**
 * This service handles the connection between client and a mulitplayer-server
 *
 * It includes the communication protocol and registers functions and events
 * Uses Socket.io and connects to a Node.js Server
 *
 * @author Sebastian Huber
 * @author Simon Heimler
 * @constructor
 */
obacht.MultiplayerService = function(serverUrl) {
    "use strict";

    //////////////////////////////
    // Model                    //
    //////////////////////////////

    this.serverUrl = serverUrl;
    /** Room PIN */
    this.pin = false;
    /** Player ID */
    this.pid = false;
    /** RoomDetail Object */
    this.roomDetail = false;
    /** Socket.io */
    this.socket = io.connect(this.serverUrl); // Set up Socket-Connection to Server

    var self = this;

    console.log("Connecting to Multiplayer Server on " + serverUrl);

    /**
     * Event Publisher/Subscriber (http://closure-library.googlecode.com/svn/docs/class_goog_pubsub_PubSub.html)
     * Handles all the Events from the Multiplayer Service
     *
     * @type {goog.pubsub.PubSub}
     */
    this.events = new goog.pubsub.PubSub();


    //////////////////////////////
    // Communication Events     //
    //////////////////////////////

    /**
     * Player is connected, else print out the error
     */
    this.socket.on('connected', function (data) {
        if (!data.error) {
            console.log('Successful Connected');
            self.pid = data.pid;
        } else {
            console.log(data.error);
        }
    });

    /**
     * Receiving Roomdetails
     */
    this.socket.on('room_detail', function (data) {
        self.roomDetail = data;
        self.pin = data.pin;
        console.log('RoomDetails received');
        console.dir(data);
        self.events.publish('room_detail', data);
    });

    /**
     * Print out errors
     */
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

    /**
     * Print out Servermessages
     */
    this.socket.on('message', function(data) {
        console.log('Incoming Message from Server:');
        console.dir(data);
    });

    /**
     * Receive an invite for a room
     * If the received pin = 0 a new random room will be created
     * Else join the the room with the received pin
     */
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

    /**
     * No Match was found
     * Create a new room
     */
    this.socket.on('no_match_found', function () {
        console.log('No Match found.');
        this.newRoom();
        self.events.publish('no_match_found');
    });

    /**
     * Game is ready
     */
    this.socket.on('game_ready', function () {
        console.log('Game is ready!');
        self.events.publish('game_ready');
    });

    /**
     * Player took an action
     */
    this.socket.on('player_action', function (data) {
        console.log('player_action: ' + data.type);
        self.events.publish('player_action', data.type, data.data);
    });

    /**
     * Receives a bonus to show it within the reactionbox
     */
    this.socket.on('bonus', function (data) {
        console.log('bonus: ' + data.type);
        self.events.publish('bonus', data.type);
    });

    /**
     * Sorts out if the player gets the bonus
     */
    this.socket.on('receive_bonus', function (data) {
        if (data.winner_pid === self.pid) {
            console.log('You won Bonus: ' + data.type);
            self.events.publish('bonus', data.type, true);
        } else {
            console.log('You lost Bonus: ' + data.type);
            self.events.publish('bonus', data.type, false);
        }
    });

    /**
     * Receives an item
     */
    this.socket.on('item', function (data) {
        console.log('Item Data received');
        console.dir(data);
        self.events.publish('item', data);
    });

    /**
     * Receives a trap
     */
    this.socket.on('trap', function (data) {
        console.log('Trap Data received');
        console.dir(data);
        self.events.publish('trap', data);
    });

    /**
     * Shows that the game is over and who won the game
     */
    this.socket.on('game_over', function (data) {
        console.log('Game over! -> ' + data.type);
        if (data.pid === self.pid){
            console.log('YOU LOSE!');
        } else {
            console.log('YOU WIN');
        }
        self.events.publish('game_over');
    });

    /**
     * Get room data for debugging
     */
    this.socket.on('get_rooms', function (data) {
        console.log('Getting Rooms Data (Debugging)');
        console.dir(data);
    });

};


//////////////////////////////
// Communication Functions  //
//////////////////////////////


/**
 * Broadcast New Room
 *
 * @param {String} theme Theme of the new world
 * @param {Object} options Options for the world, i.e. rotationspeed
 * @param {String} closed Indicator if room is privat or public
 */
obacht.MultiplayerService.prototype.newRoom = function (theme, options, closed) {
    "use strict";
    console.log('>> newRoom()');
    this.socket.emit('new_room', {
        theme: theme,
        options: options,
        closed: closed,
        creatingPlayerHealth: obacht.options.player.general.maxHealth,
        joiningPlayerHealth: obacht.options.player.general.maxHealth
    });
};

/**
 * Broadcast Join Room
 *
 * @param {Number} pin Code for joining into the room
 * @param {String} closed Indicator if Room is privat or public
 */
obacht.MultiplayerService.prototype.joinRoom = function(pin, closed) {
    "use strict";
    console.log('>> joinRoom(' + pin + ')');
    this.socket.emit('join_room', {
        pin: pin,
        closed: closed
    });
};

/**
 * Broadcast Find Match
 */
obacht.MultiplayerService.prototype.findMatch = function () {
    "use strict";
    console.log('>> findMatch()');
    this.socket.emit('find_match');
};

/**
 * Broadcast Player Ready
 */
obacht.MultiplayerService.prototype.playerReady = function () {
    "use strict";
    console.log('>> playerReady()');
    this.socket.emit('player_ready');
};

/**
 * Broadcast Player Action
 *
 * @param  {String} type Type of Player Action, i.e. 'jump'
 * @param  {Object} data ActionData
 */
obacht.MultiplayerService.prototype.playerAction = function(type, data) {
    "use strict";
    this.socket.emit('player_action', {
        type: type,
        data: data
    });
};

/**
 * Broadcast Player Status
 *
 * @param  {String} pid     Player-ID
 * @param  {Number} health    Healthstatus
 */
obacht.MultiplayerService.prototype.playerStatus = function (pid, health) {
    "use strict";
    this.socket.emit('player_status', {
        pid: pid,
        health: health
    });
};


/**
 * Broadcast Throw Bonus
 *
 * @param  {String} type Type of the Bonus, i.e. 'snake'
 */
obacht.MultiplayerService.prototype.throwBonus = function (type) {
    "use strict";
    this.socket.emit('bonus', {
        type: type
    });
};

/**
 * Broadcast Check Reactiontime
 *
 * @param  {String} type Type of the Bonus, i.e. 'snake'
 * @param  {Number} reaction_time Time the player needed to push the reactionbutton in milliseconds
 */
obacht.MultiplayerService.prototype.checkReactiontime = function (type, reaction_time) {
    "use strict";
    this.socket.emit('check_reactiontime', {
        type: type,
        reaction_time: reaction_time
    });
};

/**
 * Broadcast Leave Room
 */
obacht.MultiplayerService.prototype.leaveRoom = function() {
    "use strict";
    console.log('>> leaveRoom()');
    this.socket.emit('leave_room');
};

/**
 * Debugging Function
 */
obacht.MultiplayerService.prototype.getRooms = function() {
    "use strict";
    console.log('>> getRooms()');
    this.socket.emit('get_rooms', '');
};


//////////////////////////////
// Helper Functions         //
//////////////////////////////


/**
 * Broadcast Get Random Theme
 *
 * @returns {String} theme Theme for the Random World
 */
obacht.MultiplayerService.prototype.getRandomTheme = function() {
    "use strict";
    var availableThemes = Object.keys(obacht.themes);
    console.dir(availableThemes);
    var rand = Math.floor(availableThemes.length * Math.random());
    return availableThemes[rand];
};
