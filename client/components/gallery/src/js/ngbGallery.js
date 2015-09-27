angular.module('ngbGallery', ['ui.bootstrap'])
  .constant('GALLERY_CONFIG', {
    SEARCH_BOX: true,
    ITEM_IN_PAGE: 10,
    SORTING: true,
    PAGINATION_BAR: true,
    AUTO_ROTATE_TIME: 4
  })
  .config(['$provide', function($provide) {
    $provide.decorator('orderByFilter', ['$delegate', function($delegate) {
      var srcFilter = $delegate;
      var reIndex = function (array, index) {
        if (!index)
          index = 'index';
        for (var i = 0; i < array.length; ++i) {
          array[i][index] = i;
        }
        return array;
      };
      var extendsFilter = function() {
        var array = srcFilter.apply(this, arguments);
          array = reIndex(array,arguments[3]);
        return array;
      };
      return extendsFilter;
    }])
  }])
  .controller('ngbGalleryController', ['$scope', '$attrs','$http', '$modal', 'GALLERY_CONFIG', function($scope, $attrs, $http, $modal, GALLERY_CONFIG) {
    $scope.filteredFeed = [];
    $scope.currentPage = 1;
    $scope.maxSize = 5;

    $scope.paginationBar = (angular.isDefined($scope.paginationBar) && (typeof $scope.paginationBar === 'boolean')) ? $scope.paginationBar : GALLERY_CONFIG.PAGINATION_BAR;
    if($scope.paginationBar){
      $scope.itemsInPage = (angular.isDefined($scope.itemsInPage) && !isNaN($scope.itemsInPage)) ? $scope.itemsInPage : GALLERY_CONFIG.ITEM_IN_PAGE;
    }
    $scope.autoRotateTime = (angular.isDefined($scope.autoRotateTime) && !isNaN($scope.autoRotateTime)) ? $scope.autoRotateTime : GALLERY_CONFIG.AUTO_ROTATE_TIME;
    $scope.searchBox = angular.isDefined($scope.searchBox) ? $scope.searchBox : GALLERY_CONFIG.SEARCH_BOX;
    $scope.sorting = (angular.isDefined($scope.sorting) && (typeof $scope.sorting === 'boolean')) ? $scope.sorting : GALLERY_CONFIG.SORTING;

    $scope.$watch("currentPage + itemsInPage + feed", function() {
      if(angular.isDefined($scope.feed) && $scope.feed.length > 0){
        if(!$scope.paginationBar){
          $scope.filteredFeed = $scope.feed;
        }else {
          var begin = (($scope.currentPage - 1) * $scope.itemsInPage)
            , end = begin + $scope.itemsInPage;
          $scope.filteredFeed = $scope.feed.slice(begin, end);
        }
      }
    });


    $scope.openImage = function(image){
      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'components/gallery/src/templates/ngbGalleryModal.html',
        controller: 'ngbGalleryModalController',
        // size: size,
        windowClass: 'gallery-modal-wrap',
        resolve: {
          images: function () {
            return $scope.filteredFeed;
          },
          selectedImage: function() {
            return image;
          },
          autoRotateTime: function() {
            return $scope.autoRotateTime;
          }

        }
      });
    };

    $scope.removeImg = function(selectedImg){
      var index = $scope.feed.indexOf(selectedImg);
      $scope.feed.splice(index, 1);
      index = $scope.filteredFeed.indexOf(selectedImg);
      $scope.filteredFeed.splice(index, 1);
      if((angular.isDefined($scope.onRemoveImg)) && (typeof $scope.onRemoveImg === 'function')){
        $scope.onRemoveImg(selectedImg);
      }
    };
  }])

  .directive('ngbGallery', function() {
    return {
      restrict: 'E',
      controller: 'ngbGalleryController',
      templateUrl: 'components/gallery/src/templates/ngbGallery.html',
      replace: true,
      scope: {
        feed: '=',
        searchBox: '=?',
        itemsInPage:'=?',
        sorting: '=?',
        paginationBar: '=?',
        autoRotateTime: '=?',
        onRemoveImg: '=?'
      }
    };
  })

.controller('ngbGalleryModalController', ['$scope', '$modalInstance', 'images', 'selectedImage', 'autoRotateTime', '$interval', '$filter',
  function($scope, $modalInstance, images, selectedImage, autoRotateTime, $interval, $filter) {
    $scope.selectedImage = selectedImage;
    $scope.images = $filter('orderBy')(images, 'index');
    $scope.isPlaying = false;
    var index = $scope.selectedImage.index,
        currentInterval;

    function restartTimer() {
      resetTimer();
      var interval = autoRotateTime * 1000;
      if (!isNaN(interval) && interval > 0) {
        currentInterval = $interval(timerFn, interval);
      }
    }

    function resetTimer() {
      if (currentInterval) {
        $interval.cancel(currentInterval);
        currentInterval = null;
      }
    }

    function timerFn() {
      var interval = autoRotateTime * 1000;
      if ($scope.isPlaying && !isNaN(interval) && interval > 0) {
        $scope.next();
      } else {
        $scope.pause();
      }
    }

    $scope.next = function() {
      index++;
      if(!angular.isDefined($scope.images[index])){
        index = $scope.images[0].index;
      }
      $scope.selectedImage = $scope.images[index];

    };

    $scope.prev = function() {
      index--;
      if(!angular.isDefined($scope.images[index])){
        index = $scope.images[$scope.images.length - 1].index;
      }
      $scope.selectedImage = $scope.images[index];
    };

    $scope.play = function() {
      if (!$scope.isPlaying) {
        $scope.isPlaying = true;
        restartTimer();
      }
    };
    $scope.pause = function() {
      if (!$scope.noPause) {
        $scope.isPlaying = false;
        resetTimer();
      }
    };

    $scope.$watch('interval', restartTimer);
    $scope.$on('$destroy', resetTimer);

  }
]);
