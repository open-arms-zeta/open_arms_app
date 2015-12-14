myApp.controller('AdminWelcomeController', ["$scope", "DataService", "$http", function($scope, DataService, $http){
    console.log("AdminWelcome Controller Online");

    $scope.dataService = DataService;
    $scope.activeWeek = undefined;
    $scope.selectedStartDate = undefined;
    $scope.selectedEndDate = undefined;
    $scope.selectedMealCount = undefined;
    $scope.clientOrders = undefined;

    $scope.initSelectedWeek = function(){
        $scope.selectedStartDate = $scope.activeWeek;
        var newDate = new Date($scope.selectedStartDate);
        $scope.selectedEndDate = newDate.setDate(newDate.getDate()+6);
    };

    $scope.moveSelectedWeek = function(numDays){
        var startDate = new Date($scope.selectedStartDate);
        $scope.selectedStartDate = startDate.setDate(startDate.getDate()+ numDays);
        var endDate = new Date($scope.selectedEndDate);
        $scope.selectedEndDate = endDate.setDate(endDate.getDate()+ numDays);
    };

    $scope.previousWeek = function(){
        $scope.moveSelectedWeek(-7);
        $scope.getMealCount();
    };

    $scope.nextWeek = function(){
        $scope.moveSelectedWeek(7);
        $scope.getMealCount();
    };

    $scope.getMealCount = function(){
        var startDate = new Date($scope.selectedStartDate);
        var endDate = new Date($scope.selectedEndDate);
        $http.get('/getmealcount', {params: {startDate: startDate, endDate: endDate}}).then(function(response){
            console.log(response.data);
            $scope.selectedMealCount = response.data;
        });
    };

    $scope.getClientOrders = function(){
        var startDate = new Date($scope.selectedStartDate);
        var endDate = new Date($scope.selectedEndDate);
        $scope.dataService.retrieveClientOrders(startDate, endDate).then(function(){
           //console.log($scope.dataService.getClientOrders());
            $scope.clientOrders = $scope.dataService.getClientOrders();
            console.log($scope.clientOrders)
        });
    };

    $scope.printMealCount = function(){
        console.log($scope.selectedMealCount);
    };

    $scope.printClientOrders = function(){
        $scope.getClientOrders();
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