myApp.controller('AdminWelcomeController', ["$scope", "DataService", "$http", function($scope, DataService, $http){
    console.log("AdminWelcome Controller Online");

    $scope.dataService = DataService;
    $scope.activeWeek = undefined;
    $scope.selectedStartDate = undefined;
    $scope.selectedEndDate = undefined;
    $scope.selectedMealCount = undefined;
    $scope.clientOrders = undefined;

    //uses the active day (activeWeek variable pulled from factory) to calculate a week range used for calculation
    $scope.initSelectedWeek = function(){
        $scope.selectedStartDate = $scope.activeWeek;
        var newDate = new Date($scope.selectedStartDate);
        $scope.selectedEndDate = newDate.setDate(newDate.getDate()+6);
    };

    //Moves the selected week forward or backward based on an input
    $scope.moveSelectedWeek = function(numDays){
        var startDate = new Date($scope.selectedStartDate);
        $scope.selectedStartDate = startDate.setDate(startDate.getDate()+ numDays);
        var endDate = new Date($scope.selectedEndDate);
        $scope.selectedEndDate = endDate.setDate(endDate.getDate()+ numDays);
    };

    //moves back a week, meal count is updatedd
    $scope.previousWeek = function(){
        $scope.moveSelectedWeek(-7);
        $scope.getMealCount();
    };

    //moves forward a week, meal count is updated
    $scope.nextWeek = function(){
        $scope.moveSelectedWeek(7);
        $scope.getMealCount();
    };

    //gets meal count for a given week
    $scope.getMealCount = function(){
        var startDate = new Date($scope.selectedStartDate);
        var endDate = new Date($scope.selectedEndDate);
        $http.get('/getmealcount', {params: {startDate: startDate, endDate: endDate}}).then(function(response){
            //console.log(response.data);
            $scope.selectedMealCount = response.data;
        });
    };

    //gets client orders from the factory for a given date range
    $scope.getClientOrders = function(){
        var startDate = new Date($scope.selectedStartDate);
        var endDate = new Date($scope.selectedEndDate);
        $scope.dataService.retrieveClientOrders(startDate, endDate).then(function(){
            $scope.clientOrders = $scope.dataService.getClientOrders();
            $scope.print();
        });

    };

    //prints meal count
    //------------------------NEED TO ADD: EXPORT CSV FUNCTION -----------------------------
    $scope.printMealCount = function(){
        console.log($scope.selectedMealCount);
    };

    //prints client orders for a week
    //------------------------NEED TO ADD: EXPORT CSV FUNCTION -----------------------------
    $scope.printClientOrders = function(){
        $scope.getClientOrders();
    };

    $scope.print = function(){
        console.log($scope.clientOrders);
    };

    if ($scope.activeWeek == undefined) {
        $scope.dataService.calculateActiveWeek();
        $scope.activeWeek = $scope.dataService.getActiveWeek();
    }else{
        $scope.activeWeek = $scope.dataService.getActiveWeek();

    }
    $scope.initSelectedWeek();
    $scope.getMealCount();
}]);