function logger(knexContext) {
    return {
        knexContext: knexContext,
        addMessage: addMessage,
        addTopic: addTopic
    };
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

module.exports = logger;