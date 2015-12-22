/**
 * Created by aronthomas on 12/10/15.
 */

myApp.controller('AddClientController', ["$scope", "DataService", "$http", "$filter", function($scope, DataService, $http, $filter){

    console.log("Add client Controller Online");
    $scope.csvClients = undefined;
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


    $scope.handler=function(e,files){
        console.log($scope.myFiles);
        var reader=new FileReader();
        reader.onload=function(e){
            var string=reader.result;
            //console.log(string);
            //var obj=$filter('csvToObj')(string);
            //console.log(obj);
            var results = Papa.parse(string,{
                header: true
            });
            console.log(results);
            $scope.csvClients = results.data;
            console.log('results', $scope.csvClients)
        };
        reader.readAsText(files[0]);
        Papa.parse(files[0], {
            complete: function(results) {
                console.log('these results', $scope.csvClients);
            }
        });
    };
    //console.log($scope.categories)
}]);


myApp.directive('fileChange',['$parse', function($parse){
    return{
        require:'ngModel',
        restrict:'A',
        link:function($scope,element,attrs,ngModel){
            var attrHandler=$parse(attrs['fileChange']);
            var handler=function(e){
                $scope.$apply(function(){
                    attrHandler($scope,{$event:e,files:e.target.files});
                });
            };
            element[0].addEventListener('change',handler,false);
        }
    }
}]);

