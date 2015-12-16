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
    }else{
        $scope.activeWeek = $scope.dataService.getActiveWeek()
    }

    //pulls in menu
    if ($scope.menu == undefined) {
        $scope.dataService.retrieveMenuByWeek('2015-12-05', '2015-12-11').then(function(){
            $scope.menu = $scope.dataService.getMenu();
        });

    }else{
        $scope.menu = $scope.dataService.getMenu();
    }

    //pull in client orders
    if ($scope.clientOrders == undefined){
        $scope.dataService.retrieveClientOrders('2015-12-05', '2015-12-11').then(function(){
            $scope.clientOrders = $scope.dataService.getClientOrders();
        });
    }else {
        $scope.clientOrders = $scope.dataService.getClientOrders();
    }

    $scope.calculateMeals = function(){
        //LOOP THROUGH FORM VALUES TO ADD TO MENU COUNT
        for(var i = 0; i<$scope.menu.length; i++){
            console.log($scope.menu[i]);
            var category = _.where($scope.categories, {category_name : $scope.menu[i].category_name})[0];
            $scope.menu[i].count = category.formCount || 0;

            var clientOrders = _.where($scope.clientOrders, {entree: $scope.menu[i].entree});

            //If client orders exist for a certain value, the count for each item of clothing is extracted and summed
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
    }
}]);