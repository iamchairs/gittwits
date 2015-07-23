var GithubApi = require('github');
var fs = require('fs');

var githubConf = JSON.parse(fs.readFileSync('github.conf.json', {encoding: 'utf8'}));
var githubAuthConf = JSON.parse(fs.readFileSync('github.auth.conf.json', {encoding: 'utf8'}));

var github = new GithubApi(githubConf);
github.authenticate(githubAuthConf);

module.exports = github;