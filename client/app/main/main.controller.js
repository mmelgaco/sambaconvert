'use strict';

angular.module('sambaconvertApp')
  .controller('MainCtrl', function ($scope, $http) {

        $scope.creds = {
            bucket: 'sambaconvert',
            access_key: 'AKIAJ2TWN4ETEQMASDZA',
            secret_key: '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'
        };

        $scope.upload = function() {
            // Configure The S3 Object
            AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
            //AWS.config.region = 'us-east-1';
            var bucket = new AWS.S3({ params: { Bucket: $scope.creds.bucket } });

            if($scope.file) {
                var params = { ACL: 'public-read', Key: $scope.file.name, ContentType: $scope.file.type, Body: $scope.file, ServerSideEncryption: 'AES256' };

                var startTime = new Date().getTime();
                var options = {partSize: 5 * 1024 * 1024, queueSize: 1};
                bucket.upload(params, options, function(err, data) {

                    if(err) {
                        // There Was An Error With Your S3 Config
                        alert(err.message);
                        return false;
                    }else {
                        // Success!
                        alert('Upload Done. Location: '+data.Location);

                        //var url = 'https://s3.amazonaws.com/' + $scope.creds.bucket + '/' + $scope.file.name;
                        console.log(data.Location);

                        $scope.fileUrl = data.Location;
                    }
                }).on('httpUploadProgress',function(progress) {
                    // Log Progress Information
                    var speed = Math.round(progress.loaded / ((new Date().getTime() - startTime)/1000));
                    console.log(Math.round(progress.loaded / progress.total * 100) + '% done / speed: '+speed + ' b/s');

                    $scope.uploadProgress = Math.round(progress.loaded / progress.total * 100);
                    $scope.$digest();
                });
            }else {
                // No File Selected
                alert('No File Selected');
            }
        };

        $scope.convert = function(){

            if(!$scope.fileUrl){
                alert('No file uploaded!');
                return;
            }
            $http.post('/api/converts', {
                url: $scope.fileUrl
            }).success(function(data) {
                console.log(data);
                alert('sucesso');

                $scope.result = data;



            }).error(function(err) {
                console.log(err);
                alert('erro: '+err);
            });

        }

  });
