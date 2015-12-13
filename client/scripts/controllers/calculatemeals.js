myApp.controller('CalculateMealsController', ["$scope", "DataService", "$http", function($scope, DataService, $http){
    $scope.dataService = DataService;
    console.log("calculate meals Controller Online");
    $scope.meal = {};

    $scope.calculateMeals = function(){
        console.log($scope.meal);
    }
}]);