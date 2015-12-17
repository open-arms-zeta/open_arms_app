myApp.controller('CalculateMealsController', ["$scope", "DataService", "$http", function($scope, DataService, $http){
    console.log("calculate meals Controller Online");
    //SET VARIABLES
    $scope.dataService = DataService;
    $scope.clientOrders = $scope.dataService.getClientOrders();
    $scope.activeWeek = undefined;
    $scope.menu = undefined;
    $scope.categories = $scope.dataService.getCategories();
    $scope.displayResults = false;

    $scope.meal = {};
    $scope.mealCount = [];

    //Calculates the range (monday to sunday) for the most recent week of completed orders, this is used for determining
    //meal quantities.
    $scope.getOrderWeek = function(){
        var startDate = new Date($scope.activeWeek);
        $scope.selectedStartDate = new Date(startDate.setDate($scope.activeWeek.getDate()- 7));
        var endDate = new Date($scope.activeWeek);
        $scope.selectedEndDate = endDate.setDate($scope.activeWeek.getDate() - 1);
    };


    $scope.calculateMeals = function(){
        //LOOP THROUGH FORM VALUES TO ADD TO MENU COUNT (Each meal that applies to the category gets incremented by the amount entered in the categories field)
        for(var i = 0; i<$scope.menu.length; i++){
            console.log($scope.menu[i]);
            var category = _.where($scope.categories, {category_name : $scope.menu[i].category_name})[0];
            $scope.menu[i].count = category.formCount || 0;

            var clientOrders = _.where($scope.clientOrders, {entree: $scope.menu[i].entree});

            //If client orders exist for a certain value, the count for the meal is extracted and summed
            if(clientOrders.length>0){
                var orderNum = _.pluck(clientOrders, 'count').reduce(function(a,b){
                    return a + b;
                });
                console.log(orderNum);
                $scope.menu[i].count += orderNum;
            }
        }
        console.log($scope.menu);
        $scope.displayResults = true;
        $scope.postMealCount();
    };

    //pull in categories
    if ($scope.categories == undefined) {
        $scope.dataService.retrieveCategories().then(function(){
            $scope.categories = $scope.dataService.getCategories();
        });
    }else{
        $scope.categories = $scope.dataService.getCategories();
    }

    //pull in active week
    if ($scope.activeWeek == undefined) {
        $scope.dataService.calculateActiveWeek();
        $scope.activeWeek = $scope.dataService.getActiveWeek();
        $scope.getOrderWeek();
    }else{
        $scope.activeWeek = $scope.dataService.getActiveWeek();
        $scope.getOrderWeek();
    }

    //pulls in menu
    if ($scope.menu == undefined) {
        $scope.dataService.retrieveMenuByWeek($scope.selectedStartDate, $scope.selectedEndDate).then(function(){
            $scope.menu = $scope.dataService.getMenu();
        });

    }else{
        $scope.menu = $scope.dataService.getMenu();
    }

    //pull in client orders
    if ($scope.clientOrders == undefined){
        $scope.dataService.retrieveClientOrders($scope.selectedStartDate, $scope.selectedEndDate).then(function(){
            $scope.clientOrders = $scope.dataService.getClientOrders();
        });
    }else {
        $scope.clientOrders = $scope.dataService.getClientOrders();
    }

    $scope.postMealCount = function(){
        for(var i = 0; i<$scope.menu.length; i++){
            console.log($scope.menu[i]);
            $http.post('/mealcount', $scope.menu[i]).then(function(response){
                console.log(response);
            })
        }
    }
}]);