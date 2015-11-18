var format = require('util').format;

var dbLogger = {
    role: 'dblogger',
    requiresRoles: ['dbcore'],
    init: function(client, imports) {

        // dbcore is a promise. It is returned after migrations are complete.
        const dbLoggerPromise = imports.dbcore.then(function(knex) {
            return require('./logger')(knex)
        });

        const handleMessage = function(IRCMessage) {
            
            if (IRCMessage.command === 'notice') {
                if (!IRCMessage.nickname) {
                    IRCMessage.nickname = IRCMessage.channel;
                }
            } else if (IRCMessage.command === 'part' || IRCMessage.command === 'quit') {
                if (!IRCMessage.reason) {
                    IRCMessage.message = IRCMessage.reason;
                }
            } else if(IRCMessage.command === 'kick'){
                IRCMessage.message = format('%s kicked %s for %s', IRCMessage.kicker, IRCMessage.kicked, IRCMessage.reason);
            }

            var normalizedMessage = (IRCMessage.message || null);
            return dbLoggerPromise.then(function(logger) {
                return logger.addMessage(IRCMessage.nickname, normalizedMessage, IRCMessage.command, IRCMessage.channel).then(function() {
                    // Supress returning the ID of the inserted record
                    return;
                });
            })
        }

        var handleTopic = function(IRCMessage) {
            return dbLoggerPromise.then(function(logger) {
                return logger.addTopic(IRCMessage.topic, IRCMessage.nickname, IRCMessage.channel).then(function() {
                    // Supress returning the ID of the inserted record
                    return;
                })
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
                "topic": handleTopic
            },
            exports: {
                dbLoggerPromise: dbLoggerPromise
            }
        };
    }
};

module.exports = dbLogger;