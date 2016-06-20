'use strict';

var apiURL = 'http://172.16.10.20/api/';

module.change_code = 1;

var _ = require('lodash');
var rp = require('request-promise');
var moment = require('moment');
var Alexa = require('alexa-app');
var app = new Alexa.app('catfeeder');

var defaultPrompt = 'I can get status or feed the cat.';

app.launch(function(req, res) {
    res.say(defaultPrompt).reprompt(defaultPrompt).shouldEndSession(false);
});

app.intent('status', {
        'slots': {
        },
        'utterances': [
            '{|get|for} {|current|last} {|feed|feeding} status'
        ]
    },
    function(req, res) {
	rp({
	  method: 'GET',
	  uri: apiURL + 'status',
	  resolveWithFullResponse: true,
	  json: true
	}).then(function(r) {
	    var s = r.body;

            console.log("Status Results: ", s);

	    var response = '<s>Status as of ' + moment.unix(s.lastFeedUnixSeconds).fromNow() + '</s><s>was <say-as interpret-as="spell-out">' + s.status + '</say-as></s><s> and the feeder ran for ' + s.lastFeedSeconds + ' seconds</s>';
            res.say(response).send();
	    console.log("response: ", response);
        }).catch(function(err) {
            console.log("*ERROR* = ", err);
            res.say("I'm sorry your query failed for some reason, " + defaultPrompt).reprompt(defaultPrompt).shouldEndSession(false).send();
        });

        return false;
    }
);

app.intent('feed', {
        'slots': {
        },
        'utterances': [
            '{|start|do|please} {feed|feeding} {|the} {|cat|lucy}'
        ]
    },
    function(req, res) {
	rp({
	  method: 'GET',
	  uri: apiURL + 'feed?type=alexa',
	  resolveWithFullResponse: true,
	  json: true
	}).then(function(r) {
	    var s = r.body;
	    var response = '<s>I asked the cat feeder to feed the cat and the status was <say-as interpret-as="spell-out">' + s.status + '</say-as></s><s> and the feeder ran for ' + s.lastFeedSeconds + ' seconds</s>';
            res.say(response).send();
	    console.log("response: ", response);
        }).catch(function(err) {
            console.log("*ERROR* = ", err);
            res.say("I'm sorry your query failed for some reason, " + defaultPrompt).reprompt(defaultPrompt).shouldEndSession(false).send();
        });

        return false;
    }
);

module.exports = app;
