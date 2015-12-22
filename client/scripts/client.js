var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial']);

myApp.config(['$routeProvider', '$mdThemingProvider', function($routeProvider, $mdThemingProvider){
    $routeProvider
        .when('/main',{
            templateUrl: "/assets/views/routes/clientwelcome.html",
            controller: "ClientWelcomeController"
        })
        .otherwise('/main');

    $mdThemingProvider.theme('default')
        .primaryPalette('grey', {
            'hue-1': '50',
            'hue-2': '700',
            'hue-3': '900'
        })
        .accentPalette('orange', {
            'hue-1': 'A100',
            'hue-2': '300',
            'hue-3': '800'
        });

}]);