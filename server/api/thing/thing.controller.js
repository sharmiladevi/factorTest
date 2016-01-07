/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/things              ->  index
 * POST    /api/things              ->  create
 * GET     /api/things/:id          ->  show
 * PUT     /api/things/:id          ->  update
 * DELETE  /api/things/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var Thing = require('./thing.model');
var medium = require('medium-sdk');


export function mediumPost(req, res){
  var client = new medium.MediumClient({
    clientId: 'bfec79be0890',
    clientSecret: 'b7de235359022a725dc485e195c4d10e726095ec'
  });
  client.setAccessToken('2a37b7e7a245f21f6ca38b8f0def821c34017e91fa977d0894970960361d0dca4');
  var url = client.getAuthorizationUrl('secretState', 'http://factorroom.com:9000/medium', [
    medium.Scope.BASIC_PROFILE, medium.Scope.PUBLISH_POST
  ]);
  // (Send the user to the authorization URL to obtain an authorization code.)
  client.exchangeAuthorizationCode('2a37b7e7a245f21f6ca38b8f0def821c34017e91fa977d0894970960361d0dca4', url, function (err, token) {
    client.getUser(function (err, user) {
      console.log("here "+JSON.stringify(err));
      client.createPost({
        userId: user.id,
        title: 'A new post',
        contentFormat: medium.PostContentFormat.HTML,
        content: '<h1>Sending to medium</h1><p>This is my new post from my desktop - sharmila.</p>',
        publishStatus: medium.PostPublishStatus.DRAFT
      }, function (err, post) {
        console.log(token, user, post);
      })
    })
  });
}



function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of Things
export function index(req, res) {
  Thing.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single Thing from the DB
export function show(req, res) {
  Thing.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new Thing in the DB
export function create(req, res) {
  Thing.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Thing in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Thing.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Thing from the DB
export function destroy(req, res) {
  Thing.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
