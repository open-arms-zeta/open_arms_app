/**
 * Created by aronthomas on 12/10/15.
 */
myApp.controller('AddClientController', ["$scope", "DataService", "$http", function($scope, DataService, $http){
    console.log("Add client Controller Online");

    $scope.dataService = DataService;
    $scope.categories = undefined;
    $scope.newClient = {};

    if ($scope.categories == undefined) {
        $scope.dataService.retrieveCategories().then(function(){
            $scope.categories = $scope.dataService.getCategories();
            console.log($scope.categories);
        });
    }else{
        $scope.categories = $scope.dataService.getCategories();
    }

    $scope.associateCategoryID = function(){
        console.log($scope.categories);
    };

    $scope.submit = function(){
        console.log($scope.newClient);
        $scope.newClient.password = $scope.newClient.phone.toString();
        $http.post('/register',$scope.newClient).then(function(response){
            console.log(response.data);
        });
    };

    console.log($scope.categories)
}]);