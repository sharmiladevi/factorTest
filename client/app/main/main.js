
angular.module('factorRoomApp')
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/views/landing.html',
        controller: 'LandingCtrl',
        controllerAs: 'main'
      })
      ;
  });
