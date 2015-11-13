var Promise = require('bluebird'),
    path = require('path'),
    format = require('util').format;

// Get the path of the module so we can access its assets
const moduleHomeDir = __dirname;
const migrationPath = path.join(moduleHomeDir, 'migrations');

var dbLogger = {
    role: 'dblogger',
    init: function(client, imports) {

        var knexContext = require('knex')(client.config('database'));
        const logger = require('./logger')(knexContext, migrationPath, client);

        const handleMessage = function(IRCMessage) {
            if (IRCMessage.command === 'notice') {
                if (!IRCMessage.nickname) {
                    IRCMessage.nickname = IRCMessage.channel;
                }
            }

            if (IRCMessage.command === 'part' || IRCMessage.command === 'quit' || IRCMessage.command === 'kick') {
                if (!IRCMessage.reason) {
                    IRCMessage.message = IRCMessage.reason;
                }
            }

            var normalizedMessage = (IRCMessage.message || null);
            return logger.then(function(loggingUtilities) {
                loggingUtilities.addMessage(IRCMessage.nickname, normalizedMessage, IRCMessage.command, IRCMessage.channel).then(function() {
                    // Supress returning the ID of the inserted record
                    return;
                });
            });
        }

        var handleTopic = function(IRCMessage) {
            return logger.then(function(loggingUtilities) {
                return loggingUtilities.addTopic(IRCMessage.topic, IRCMessage.nickname, IRCMessage.channel).then(function() {
                    // Supress returning the ID of the inserted record
                    return;
                });
            });
        }

        return {
            handlers: {
                "privmsg": handleMessage,
                "notice": handleMessage,
                "join": handleMessage,
                "part": handleMessage,
                "quit": handleMessage,
                "kick": handleMessage,
                "nick": handleMessage,
                "topic": handleTopic
            },
            exports: {
                dblogger: logger,
                knexContext: knexContext
            }
        };
    }
};

module.exports = dbLogger;