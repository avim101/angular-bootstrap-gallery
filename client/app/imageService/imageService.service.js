'use strict';

angular.module('frontTestApp')
  .service('imageService', function ($http, $q) {

      function addImage(image) {

        var request = $http({
          method: "post",
          url: "/api/images",
          data: {
            title: "test",
            url: "http://cdn.playbuzz.com/cdn/cb7190c0-906c-4bfc-8725-2d308c40f60a/e0949af2-7ba9-4fe3-8d95-df5d15af0661.jpg",
            date: new Date()
          }
        });

        return( request.then( handleSuccess, handleError ) );

      }

      function getImages() {
        var request = $http({
          method: "get",
          url: "/assets/images/images.json"
        });

        return( request.then( handleSuccess, handleError ) );

      }

      function removeImage( id ) {

        var request = $http({

          method: "delete",
          url: "api/images/"+id
        });

        return( request.then( handleSuccess, handleError ) );

      }

      function handleError( response ) {

        if (! angular.isObject( response.data ) || ! response.data.message) {

          return( $q.reject( "An unknown error occurred." ) );

        }

        return( $q.reject( response.data.message ) );

      }

      function handleSuccess( response ) {

        return( response.data );

      }

    return({
      addImage: addImage,
      getImages: getImages,
      removeImage: removeImage
    });


  });
