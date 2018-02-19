module.exports = {
  "development": {
    "username"  : "postgres",
    "password"  : "password",
    "database"  : "trippediacity",
    "host"      : "127.0.0.1",
    "dialect"   : "postgres"
  },
  "production": {
    "username"      : process.env.PG_USERNAME,
    "password"      : process.env.PG_PASSWORD,
    "database"      : process.env.PG_DATABASE,
    "host"          : process.env.PG_HOST,
    "dialect"       : "postgres",
    "ssl"           : true,
    "dialectOptions": { "ssl": {"require":true} }
  }
}
