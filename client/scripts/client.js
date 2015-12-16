var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/main',{
            templateUrl: "/assets/views/routes/clientwelcome.html",
            controller: "ClientWelcomeController"
        })
        .otherwise('/main')
}]);