# tennu-DBLogger 1.0.0

A database logging utility for the [tennu](https://github.com/Tennu/tennu) irc framework.

tennu-DBLogger uses [knex](http://knexjs.org/) on its backend. This means that if you wish to change from the default Sqlite3 DB you will have to follow their documentation and update the configuration below. I have provided a couple of examples.

### Configuration

Add this to your tennu configuration (be sure to strip comments):

```javascript
"database": {
    "client": "sqlite3",
    "connection": {
      "filename": "./tennu.sqlite"
    }
}
```

```javascript
// make sure to `npm install mysql2`
"database": {
    "client": "mysql2",
    "connection": {
        "host": "localhost",
        "user": "tennu-bot",
        "password": "password",
        // make sure this db actually exists, and that your user has access to it
        "database": "tennu"
    }
  }
```


### Features

Logs these events
- privmsg (PMs included)
- join
- part
- quit
- kick
- notice
- topic

### Required by

This plugin is required by the following plugins.
- tennu-advanced-seen (comming soon)
- tennu-title (comming soon)

### Installing Into Tennu

See Downloadable Plugins [here](https://tennu.github.io/plugins/).

### Requires Plugins
Requires [admin](https://tennu.github.io/plugins/admin).
 
### Todo:

- Tests
 
### License

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

 Copyright (C) 2015 Victorio Berra

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.
