myApp.controller('ClientWelcomeController', ["$scope", "DataService", "$http", function($scope, DataService, $http){
    console.log("Client Welcome Controller Online");

    $scope.dataService = DataService;
    $scope.user = undefined;
    $scope.activeWeek = undefined;
    $scope.menu = undefined;

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

    //pulls in menu
    if ($scope.menu == undefined) {
        $scope.dataService.retrieveMenuByWeek('2015-12-05', '2015-12-05').then(function(){
            $scope.menu = $scope.dataService.getMenu();
            console.log($scope.menu)
        });

    }else{
        $scope.menu = $scope.dataService.getMenu();
    }


    $scope.customize = function(){
        $scope.customized = true;
    };

    $scope.completeOrder = function(){
        $scope.mealsChosen = true;
    };



}]);

