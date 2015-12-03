
sambaconvert
=================

A sample application written using Node.js, AngularJS and the AWS JS SDK to demonstrate uploading files to AWS S3 and video encoding using Zencoder ( zencoder.com )

[You can view a live demo of this application here](http://52.32.80.140:9000/)

It writes a document on mongodb after conversion successfully with the original url and the converted url.

Main Required Libraries
-------------------
* AngularJS
* AWS JavaScript SDK

## Usage

Run npm install / bower install to download the deps.

Run `grunt` for building, `grunt serve` for preview, and `grunt serve:dist` for a preview of the built app.

## Prerequisites

* MongoDB - Download and Install [MongoDB](http://www.mongodb.org/downloads)
* Node.js - Download and Install [Node.js](https://nodejs.org)

## Testing

Running `grunt test` will run the client and server unit tests with karma and mocha.

Use `grunt test:server` to only run server tests.

Use `grunt test:client` to only run client tests.

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)

