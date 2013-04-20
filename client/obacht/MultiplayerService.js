/* global goog, obacht */
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
