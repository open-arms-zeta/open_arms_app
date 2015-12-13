myApp.controller('CalculateMealsController', ["$scope", "DataService", "$http", function($scope, DataService, $http){
    console.log("calculate meals Controller Online");
    //SET VARIABLES
    $scope.dataService = DataService;
    $scope.clientOrders = undefined;
    $scope.activeWeek = undefined;
    $scope.meal = {};

    if ($scope.activeWeek == undefined) {
        $scope.dataService.calculateActiveWeek();
        $scope.activeWeek = $scope.dataService.getActiveWeek();
    }else{
        $scope.activeWeek = $scope.dataService.getActiveWeek()
    }

    if ($scope.clientOrders == undefined){
        $scope.dataService.retrieveClientOrders('2015-12-05', '2015-12-05').then(function(){
            $scope.clientOrders = $scope.dataService.getClientOrders();
        });
    }else {
        $scope.clientOrders = $scope.dataService.getClientOrders();
    }

    $scope.calculateMeals = function(){
        console.log($scope.meal);
        console.log($scope.clientOrders);
        console.log($scope.activeWeek);
    }
}]);