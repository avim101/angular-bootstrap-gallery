'use strict';

angular.module('frontTestApp')
  .controller('MainCtrl', function ($scope, $http, imageService, toaster ,$timeout) {
   $scope.images = [];

    $scope.removeImage = function(img){
      imageService.removeImage(img._id)
        .then(function(res) {
          toaster.pop('success', "Success", 'Image deleted successfully', 2500);
        })
        .catch(function(response) {
          toaster.pop('error', "Oops", 'An unknown error occurred.', 2500);
          console.error('Gists error', response.status, response.data);
        });
    };

    imageService.getImages()
      .then(function(response) {
        //use fake data
        if(response.length !== 0){
          $scope.images = response;
        }
      })
      .catch(function(response) {
        console.error('Gists error', response.status, response.data);
      });

  });
