exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists("message", function(table) {
        table.increments("ID").primary();
        table.string("FromNick", 30);
        table.string("Message", 512);
        table.string('MessageType', 10);
        table.string("Channel", 200);
        table.string("Hostname", 255);
        table.timestamp("Timestamp");
    }).then(function() {
        return knex.schema.createTableIfNotExists("topic", function(table) {
            table.increments("ID").primary();
            table.string("Content").notNullable();
            table.string("SetByNick").notNullable();
            table.string("Channel").notNullable();
            table.timestamp("Timestamp");
        });
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("message").then(function() {
        return knex.schema.dropTableIfExists("topic");
    });
};