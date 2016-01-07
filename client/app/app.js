
angular.module('factorRoomApp', [
  'factorRoomApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'ngAnimate',
  'ngTouch'
])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/test', {
        templateUrl: 'app/test.html',
        controller: 'testCtrl',
        controllerAs: 'auth'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/logout', {
        templateUrl: 'views/landing.html',
        controller: 'LogoutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });

/*angular
  .module('factorRoomApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'angularFilepicker',
    'factorRoomApp.controllers',
    'factorRoomApp.enums',
    'factorRoomApp.services',
    'factorRoomApp.factories'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/landing.html',
        controller: 'LandingCtrl'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/logout', {
        templateUrl: 'views/landing.html',
        controller: 'LogoutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      $locationProvider.html5Mode(true);
  });*/
