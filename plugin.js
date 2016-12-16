var format = require('util').format;
var path = require('path');

var dbLogger = {
    role: 'dblogger',
    requiresRoles: ['dbcore'],
    init: function(client, imports) {

        const knex = imports.dbcore.knex;

        var dbLoggerPromise = knex.migrate.latest({
                tableName: 'tennu_dblogger_knex_migrations',
                directory: path.join(__dirname, 'migrations')
            }).then(function() {
            return require('./lib/logger')(knex);
        });

        const handleMessage = function(IRCMessage) {

            if (IRCMessage.command === 'notice') {
                if (!IRCMessage.nickname) {
                    IRCMessage.nickname = IRCMessage.channel;
                }
            }
            else if (IRCMessage.command === 'part' || IRCMessage.command === 'quit') {
                if (!IRCMessage.reason) {
                    IRCMessage.message = IRCMessage.reason;
                }
            }
            else if (IRCMessage.command === 'kick') {
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
                'privmsg': handleMessage,
                'notice': handleMessage,
                'join': handleMessage,
                'part': handleMessage,
                'quit': handleMessage,
                'kick': handleMessage,
                'topic': handleTopic
            },
            exports: {
                dbLoggerPromise: dbLoggerPromise
            }
        };
    }
};

module.exports = dbLogger;
