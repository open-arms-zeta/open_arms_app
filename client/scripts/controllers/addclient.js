/**
 * Created by aronthomas on 12/10/15.
 */

myApp.controller('AddClientController', ["$scope", "DataService", "$http", "$uibModal", function($scope, DataService, $http, $uibModal){

    console.log("Add client Controller Online");
    $scope.dataService = DataService;
    $scope.categories = undefined;
    $scope.clients = undefined;
    $scope.newClient = {};


    if($scope.clients == undefined){
        $http.get('/register/all').then(function(response){
            $scope.clients = response.data;
            console.log('clients in db', $scope.clients);
        })
    }

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
        if($scope.addClientForm.$valid){
            console.log($scope.newClient);
            $scope.newClient.password = $scope.newClient.phone.toString();
            $http.post('/register',$scope.newClient).then(function(response){
                console.log(response.data);
            });
            $scope.clearInput();
        }

    };

    //Clear form input
    $scope.clearInput = function() {
        $scope.newClient = {};
        $scope.addClientForm.$setUntouched();
    };



    //csv modal
    $scope.openCSVModal = function(){
        var size = 'lg';

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/assets/views/templates/importclients.html',
            controller: 'ImportClientController',
            size: size
        });

        modalInstance.result.then(function(){
            console.log('modal closed')
        });
    };

    $scope.clientExists = function(clientEmail){
        console.log( _.findWhere($scope.clients, {email: clientEmail}));
        return $scope.$apply(function(){
            if(_.findWhere($scope.clients, {email: clientEmail})){
                $scope.addClientForm.inputEmail.$setValidity('unique', false);
                //addClientForm.inputEmail.$duplicate = true;
                return true
            }else{
                $scope.addClientForm.inputEmail.$setValidity('unique', true);
                //addClientForm.inputEmail.$duplicate = false;
                return false
            }
        });
        //return _.findWhere($scope.clients, {email: clientEmail});
    }
}]);


myApp.directive('isUnique', ['$http', 'DataService', function($http, DataService){
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            element.on('keyup', function(){
                var entry = element[0].value;
                return $http.get('/register/all').then(function(response){
                    var clients = response.data;
                    if(_.findWhere(clients, {email: entry}) && entry.length >0){
                        console.log('true!');
                        ctrl.$setValidity('isunique', false);
                    }else{
                        console.log('false!');
                        ctrl.$setValidity('isunique', true);
                    }
                });
            });
        }
    };
}]);


