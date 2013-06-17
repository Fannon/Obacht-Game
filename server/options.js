/* global module */

/**
 * Obacht Game Server Options
 */
var options = {
    maxPrivateRooms: 9999,
    maxPublicRooms: 12000,
    defaultPort: 8080, // If no console argument used
    roomPurgeTimeout: 30, // In Minutes
    roomPurgeInterval: 60, // In Minutes
    debug: {
        loglevel: 0,
        timestamp: true,
        debugClient: true
    },
    gameplay: {
        trapMinInterval: 650,
        delayTrap: 650
    }

};

module.exports = options;
