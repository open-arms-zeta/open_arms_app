myApp.controller('ClientWelcomeController', ["$scope", "DataService", "$http", function($scope, DataService, $http){
    console.log("Client Welcome Controller Online");

    $scope.dataService = DataService;
    $scope.user = undefined;
    $scope.activeWeek = undefined;
    $scope.menu = undefined;
    $scope.categories = undefined;

    $scope.mealsChosen = false;
    $scope.customized = false;

    //get user
    if ($scope.user == undefined) {
        $scope.dataService.retrieveUser().then(function(){
            $scope.user = $scope.dataService.getUser();
        });
    }else{
        $scope.user = $scope.dataService.getUser();
    }

    //pull in active week
    if ($scope.activeWeek == undefined) {
        $scope.dataService.calculateActiveWeek();
        $scope.activeWeek = $scope.dataService.getActiveWeek();
    }else{
        $scope.activeWeek = $scope.dataService.getActiveWeek()
    }

    //pull in categories
    if ($scope.categories == undefined) {
        $scope.dataService.retrieveCategories().then(function(){
            $scope.categories = $scope.dataService.getCategories();
        });
    }else{
        $scope.categories = $scope.dataService.getCategories();
    }

    //pulls in menu
    //-------------------To do: have this select the menu for the active week
    if ($scope.menu == undefined) {
        $scope.dataService.retrieveMenuByWeek('2015-12-05', '2015-12-05').then(function(){
            $scope.menu = $scope.dataService.getMenu();
            console.log($scope.menu)
        });

    }else{
        $scope.menu = $scope.dataService.getMenu();
    }

    //If user wishses to customize, this value is set to true
    $scope.customize = function(){
        $scope.customized = true;
    };

    //If user completes order, this value is set to true and the program is terminated
    //-------------------To do: check client orders for active week to see if user has already chosen meals
    $scope.completeOrder = function(){
        $scope.mealsChosen = true;
    };



}]);

