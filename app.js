
var Sequelize = require('sequelize');
var fs = require('fs');
var q = require('q');
var moment = require('moment');

var database = require('./services/database.service');
var github = require('./services/github.service');

var updateInterval;
var postIds = {};
var userIds = {};
var count = 0;
var perPage = 100;
var page;

database
  .ready()
  .then(loadPostIds)
  .then(loadUserIds)
  .then(updatePagination)
  .then(setUpdateInterval);

function loadPostIds () {
  return database.Twit.findAll().then(function(res) {
    for(var i = 0; i < res.length; i++) {
      postIds[res[i].dataValues.commentId] = true;
    }

    count = res.length;
  });
}

function loadUserIds () {
  return database.User.findAll().then(function(res) {
    for(var i = 0; i < res.length; i++) {
      userIds[res[i].dataValues.userId] = true;
    }
  });
}

function checkUpdates () {
  return pullEvents()
    .then(processPull)
    .then(updatePagination);
}

function pullEvents () {
  var defer = q.defer();

  github.events.getReceived({
    user: 'gittwits',
    page: page,
    'per_page': perPage
  }, function(err, responses) {
    if(err) {
      defer.reject(err);
    } else {
      defer.resolve(responses);
    }
  });

  return defer.promise;
}

function processPull (responses) {
  var add = [];

  for(var i = 0; i < responses.length; i++) {
    var response = responses[i];
    if(!postIds[response.id] && response.payload.action === 'created') {
      postIds[response.id] = true;
      add.push(response);
    }
  }

  return addComments(add);
}

function addComments (responses) {
  var i = -1;

  next();

  function next() {
    if(++i < responses.length) {
      var response = responses[i];
      var authorId = response.actor.id;
      var Author;
      var userAction = getUser;

      if(!userIds[authorId]) {
        userAction = createUser
      }

      Author = userAction(response.actor)
        .then(createComment)
        .then(next);

      function createComment (Author) {
        return database.Twit.create({
          commentId: response.id,
          commentType: (response.type === 'IssueCommentEvent') ? 'Issue' : 'PullRequest',
          message: response.payload.comment.body,
          messageLength: response.payload.comment.body.length,
          messageUrl: response.payload.comment.html_url,
          time: moment(response.payload.comment.created_at).unix()
        }).then(function(Twit) {
          Twit.setAuthor(Author);
        });
      }
    }
  }
}

function getUser(user) {
  return database.User.find({where: {userId: user.id}});
}

function createUser(user) {
  return database.User.create({
    userId: user.id,
    username: user.login,
    url: user.url,
    avatarUrl: user.avatar_url
  }).then(function(User) {
    userIds[user.id] = true;
    return User;
  });
}

/* Using the promise here to make it chainable */
function updatePagination () {
  var defer = q.defer();

  page = Math.floor(count/perPage);
  defer.resolve(page);

  return defer.promise;
}

function setUpdateInterval () {
  // Check for updates every minute
  updateInterval = setInterval(checkUpdates, 1000*60);
}