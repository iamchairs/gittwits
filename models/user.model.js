var sequelize = require('sequelize');

module.exports = function(connection) {
  return connection.define('User', {
    userId: sequelize.BIGINT,
    username: sequelize.STRING,
    url: sequelize.STRING,
    avatarUrl: sequelize.STRING
  });
}