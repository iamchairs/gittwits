var sequelize = require('sequelize');

module.exports = function(connection) {
  return connection.define('Hashtag', {
    name: sequelize.STRING
  });
}