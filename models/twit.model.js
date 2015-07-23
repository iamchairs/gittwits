var sequelize = require('sequelize');

module.exports = function(connection) {
  var Hashtag = require('./hashtag.model')(connection);
  var User = require('./user.model')(connection);

  var Twit = connection.define('Twit', {
    commentId: sequelize.BIGINT,
    commentType: sequelize.ENUM('Issue', 'PullRequest'),
    message: sequelize.TEXT,
    messageLength: sequelize.INTEGER,
    messageUrl: sequelize.STRING,
    time: sequelize.BIGINT
  });

  Twit.Hashtag = Hashtag;
  Twit.User = User;

  Twit.hasMany(Hashtag);
  Twit.hasMany(User);
  Twit.hasOne(User, {as: 'Author'});

  return Twit;
}