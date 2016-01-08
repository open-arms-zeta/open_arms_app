myApp.controller('AdminWelcomeController', ["$scope", "DataService", "$http", "$filter", function($scope, DataService, $http, $filter){
    console.log("AdminWelcome Controller Online");

    $scope.dataService = DataService;
    $scope.activeWeek = undefined;
    $scope.orderDate = undefined;
    $scope.selectedStartDate = undefined;
    $scope.selectedMealCount = undefined;
    $scope.clientOrders = undefined;

    //uses the active day (activeWeek variable pulled from factory) to calculate a week range used for calculation
    $scope.initSelectedWeek = function(){
        var startDate = new Date($scope.activeWeek);
        console.log(startDate);
        $scope.selectedStartDate = $scope.orderDate = new Date(startDate.setDate($scope.activeWeek.getDate()- 7));
        console.log($scope.selectedStartDate);

    };

    //Moves the selected week forward or backward based on an input
    $scope.moveSelectedWeek = function(numDays){
        var startDate = new Date($scope.selectedStartDate);
        $scope.selectedStartDate = startDate.setDate(startDate.getDate()+ numDays);
        $scope.getMealCount();
        $scope.getClientOrders();
    };

    //moves back a week, meal count is updatedd
    $scope.previousWeek = function(){
        $scope.moveSelectedWeek(-7);
    };

    //moves forward a week, meal count is updated
    $scope.nextWeek = function(){
        $scope.moveSelectedWeek(7);
    };

    //gets meal count for a given week
    $scope.getMealCount = function(){
        var startDate = new Date($scope.selectedStartDate);
        console.log('start date', startDate);
        //var endDate = new Date($scope.selectedEndDate);
        //console.log('end dat', endDate);
        $http.get('/mealcount', {params: {startDate: startDate}}).then(function(response){
            //console.log(response.data);
            //$scope.selectedMealCount = response.data;
            $scope.selectedMealCount = $scope.formatForDisplay(response.data);
        });
    };

    //gets client orders from the factory for a given date range
    $scope.getClientOrders = function(){
        var startDate = new Date($scope.selectedStartDate);
        //var endDate = new Date($scope.selectedEndDate);
        $scope.dataService.retrieveClientOrders(startDate).then(function(){
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
            //$scope.selectedMealCount[i].end_date = $filter('date')($scope.selectedMealCount[i].end_date, 'fullDate');
        }
        return $scope.selectedMealCount;
    };

    //prints client orders for a week
    //------------------------NEED TO ADD: EXPORT CSV FUNCTION -----------------------------
    $scope.printClientOrders = function(){
        console.log($scope.clientOrders);
        for(var i = 0; i<$scope.clientOrders.length; i++){
            $scope.clientOrders[i].start_date = $filter('date')($scope.clientOrders[i].start_date, 'fullDate');
            //$scope.clientOrders[i].end_date = $filter('date')($scope.clientOrders[i].end_date, 'fullDate');
        }
        return $scope.clientOrders;
    };

    //format for display
    $scope.formatForDisplay = function(data){
        console.log(data);
        var groupedObject = _.groupBy(data , 'entree');
        console.log(groupedObject, 'goaspfasdf');
        var returnArray = [];
        for(var key in groupedObject){
            console.log('key', key);
            returnArray.push(groupedObject[key][0]);
            for (var i = 1; i<groupedObject[key].length; i++){
                returnArray[returnArray.length-1].count += groupedObject[key][i].count;
            }
        }
        return returnArray;
    };

    $scope.disableNext = function() {
        if(typeof $scope.selectedEndDate === 'object'){
            return $scope.orderDate<=$scope.selectedStartDate.getTime()
        }else{
            console.log(typeof $scope.orderDate);
            console.log(typeof $scope.selectedStartDate);
            return $scope.orderDate<=$scope.selectedStartDate;
        }
        //console.log(typeof $scope.orderDate);
        //console.log(typeof $scope.selectedStartDate);
        //console.log($scope.orderDate>$scope.selectedStartDate);
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
    $scope.getClientOrders();
}]);
