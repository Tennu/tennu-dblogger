function logger(knexContext, migrationPath, client) {
    return MigrateAndSeed(knexContext, migrationPath, client).then(function() {
        return {
            knexContext: knexContext,
            addMessage: addMessage,
            addTopic: addTopic
        };
    });
}

function addMessage(fromNick, message, messageType, channel) {
    return this.knexContext('message').insert({
        FromNick: fromNick,
        Message: message,
        messageType: messageType,
        Channel: channel,
        Timestamp: new Date()
    });
}

function addTopic(topic, setByNick, channel) {
    return this.knexContext('topic').insert({
        SetByNick: setByNick,
        Content: topic,
        Channel: channel,
        Timestamp: new Date()
    });
}

// private
function MigrateAndSeed(knex, migrationPath, client) {
    return knex.migrate.latest({
        directory: migrationPath
    }).then(function() {
        client._logger.notice('DBLogger database initialized.');
    });
}

module.exports = logger;