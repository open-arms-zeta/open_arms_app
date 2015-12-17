myApp.controller('AdminWelcomeController', ["$scope", "DataService", "$http", "$filter", function($scope, DataService, $http, $filter){
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
        $scope.getClientOrders();
    };

    //moves forward a week, meal count is updated
    $scope.nextWeek = function(){
        $scope.moveSelectedWeek(7);
        $scope.getMealCount();
        $scope.getClientOrders()
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
        });

    };

    //prints meal count
    //------------------------NEED TO ADD: EXPORT CSV FUNCTION -----------------------------
    $scope.printMealCount = function(){
        console.log($scope.selectedMealCount);
        //console.log($filter('date')($scope.selectedMealCount.start_date, 'fullDate'));
        for(var i = 0; i<$scope.selectedMealCount.length; i++){
            $scope.selectedMealCount[i].start_date = $filter('date')($scope.selectedMealCount[i].start_date, 'fullDate');
            $scope.selectedMealCount[i].end_date = $filter('date')($scope.selectedMealCount[i].end_date, 'fullDate');
        }
        return $scope.selectedMealCount;
    };

    //prints client orders for a week
    //------------------------NEED TO ADD: EXPORT CSV FUNCTION -----------------------------
    $scope.printClientOrders = function(){
        console.log($scope.clientOrders);
        for(var i = 0; i<$scope.selectedMealCount.length; i++){
            $scope.clientOrders[i].start_date = $filter('date')($scope.clientOrders[i].start_date, 'fullDate');
            $scope.clientOrders[i].end_date = $filter('date')($scope.clientOrders[i].end_date, 'fullDate');
        }
        return $scope.clientOrders;
    };

    //$scope.print = function(){
    //    console.log($scope.clientOrders);
    //    return $scope.clientOrders;
    //};

    if ($scope.activeWeek == undefined) {
        $scope.dataService.calculateActiveWeek();
        $scope.activeWeek = $scope.dataService.getActiveWeek();
    }else{
        $scope.activeWeek = $scope.dataService.getActiveWeek();

    }
    $scope.initSelectedWeek();
    $scope.getMealCount();
}]);