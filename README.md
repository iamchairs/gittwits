gittwits
---------

This is the NodeJS server that syncs github with gittwits.com. The actual HTTP server can be found [here](https://github.com/iamchairs/gittwits.com).

# Installation

```
# pull gittwits source
git clone https://github.com/iamchairs/gittwits.git
cd gittwits

# rename sample config files
mv db.conf.sample.json db.conf.json
mv github.auth.conf.sample.json github.auth.conf.json
mv github.conf.sample.json github.conf.json
```

## Update Conf Files

**db.conf.json**

This file defines the connection to the sql database. Under dialect chose which sql database you'l use (MongoDB not supported).
If you are you SQLite set the `storage` property. Otherwise, remove it.

```
{
  "host": "localhost",
  "port": 3306,
  "database": "gittwits",
  "username": "username",
  "password": "password",
  "dialect": "mysql"|"mariadb"|"sqlite"|"postgres"|"mssql", // Choose one
  "storage": "path/to/database.sqlite" // SQLite Only. Delete if this doesn't apply.
}
```

**github.auth.conf.json**

This file defines the auth params for the [GitHub API](https://developer.github.com/v3/).

```
{
  "type": "basic",
  "username": "username",
  "password": "password"
}
```

**github.conf.json**

This file defines the connection to the API. `User-Agent` is optional.

```
{
  "version": "3.0.0",
  "debug": true,
  "protocol": "https",
  "host": "api.github.com",
  "pathPrefix": "", 
  "timeout": 0,
  "headers": {
    "user-agent": "gittwits"
  }
}
```

# Run It

```
node app.js
```

If you didn't configure this app, your database, or your api connection properly, you'l see some errors thrown.