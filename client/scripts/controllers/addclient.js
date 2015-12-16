/**
 * Created by aronthomas on 12/10/15.
 */
myApp.controller('AddClientController', ["$scope", "DataService", "$http", function($scope, DataService, $http){
    console.log("Add client Controller Online");

    $scope.dataService = DataService;

    //$scope.newClient = {
    //
    //};

    $scope.categories = [];


    $scope.retrieveCategories = function(){
        $http({
            method: 'GET',
            url: '/getcategories'
        }).then(function(response) {
            $scope.categories = response.data;
            console.log("Here are the categories: ", $scope.categories);
            console.log($scope.categories[0].category_name);
        })
    };


    $scope.retrieveCategories();

    //$scope.submit = function(){
    //    console.log($scope.newClient)
    //};


    //VALIDATION
    $scope.submitForm = function() {

        // check to make sure the form is completely valid
        if ($scope.addClientForm.$valid) {
            //alert('New client added!');
            //post new client!
            console.log($scope.client);
            $scope.clearInput();
        }
    };

    //Clear form input
    $scope.clearInput = function() {
        $scope.client = null;
        $scope.addClientForm.$setUntouched();
    };

}]);