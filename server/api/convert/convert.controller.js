'use strict';

var _ = require('lodash');
var Convert = require('./convert.model');
var request 	= require('request');
var Q          	= require('q');

// Get list of converts
exports.index = function(req, res) {
  Convert.find(function (err, converts) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(converts);
  });
};

// Get a single convert
exports.show = function(req, res) {
  Convert.findById(req.params.id, function (err, convert) {
    if(err) { return handleError(res, err); }
    if(!convert) { return res.status(404).send('Not Found'); }
    return res.json(convert);
  });
};

function checkOutputStatus(requestOptions, deferred, payload) {
    request(requestOptions, function (err, response, body) {
        if (err) {
            console.log(err);
            deferred.reject({
                error: 500,
                message: 'Error on zencoder status request'
            });
        } else {
            console.log('job status code: %j', response.statusCode);
            console.log('job response:\n%j', body);
            if (response.statusCode == 200) {

                payload.output = JSON.parse(body);

                //check if the output status = finished, only return after this
                if (payload.output.state == 'finished') {
                    deferred.resolve(payload);
                } else {
                    checkOutputStatus(requestOptions, deferred, payload);
                }

            } else {
                console.log(body);
                deferred.reject({
                    error: 500,
                    message: 'Wrong zencoder response'
                });
            }
        }
    });
}
exports.create = function(req, res) {
    Convert.create(req.body, function(err, convert) {
        if(err) { return handleError(res, err); }

        var zencoderApiKey = '7870c34654cfa54298336295453548eb';

      var payload = {};
      Q.fcall(function() {

          var deferred = Q.defer();

          var requestOptions = {
              uri: 'https://app.zencoder.com/api/v2/jobs',
              method: 'POST',
              json: {
                  api_key: zencoderApiKey,
                  input: req.body.url,
                  outputs: [
                      {
                          public: true
                      }
                  ]
              }
          };

          console.log('starting job on zencoder:\n%j', requestOptions);
          request(requestOptions, function(err, response, body) {
              if(err) {
                  console.log(err);

                  deferred.reject({
                      error: 500,
                      message: 'Error on zencoder job creation'
                  });
              } else {
                  console.log('job status code: %j', response.statusCode);
                  console.log('job response:\n%j', body);
                  if(response.statusCode == 201) {
                      payload.jobResults = body;
                      deferred.resolve(payload);
                  } else {
                      console.log(body);
                      deferred.reject({
                          error: 500,
                          message: 'Wrong zencoder response'
                      });
                  }
              }
          });
          return deferred.promise;

      }).then(function(payload) {

          console.log(payload);

          console.log('getting output details');

          var deferred = Q.defer();

          var requestOptions = {
              uri: 'https://app.zencoder.com/api/v2/outputs/'+payload.jobResults.outputs[0].id+'.json?api_key='+zencoderApiKey,
              method: 'GET'
          };
          console.log(requestOptions);

          checkOutputStatus(requestOptions, deferred, payload);

          return deferred.promise;

      }).then(function(payload) {

          console.log(payload);

          convert.original = req.body.url;
          convert.encoded  = payload.output.url;
          convert.save();

          console.log(convert);

          return res.status(201).json(convert);

      }).catch(function(err) {
          console.log(err);
          if(err.error) {
              res.status(500).json(err.error, {
                  error: err
              });
          } else {
              res.status(500).json(500, {
                  error: err
              });
          }
      }).done();


  });
};

// Updates an existing convert in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Convert.findById(req.params.id, function (err, convert) {
    if (err) { return handleError(res, err); }
    if(!convert) { return res.status(404).send('Not Found'); }
    var updated = _.merge(convert, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(convert);
    });
  });
};

// Deletes a convert from the DB.
exports.destroy = function(req, res) {
  Convert.findById(req.params.id, function (err, convert) {
    if(err) { return handleError(res, err); }
    if(!convert) { return res.status(404).send('Not Found'); }
    convert.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}