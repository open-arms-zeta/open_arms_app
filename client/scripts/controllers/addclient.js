/**
 * Created by aronthomas on 12/10/15.
 */

myApp.controller('AddClientController', ["$scope", "DataService", "$http", "$filter", function($scope, DataService, $http, $filter){

    console.log("Add client Controller Online");
    $scope.myFiles = [];
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

    $scope.readCSV = function(){
        console.log($scope.myFiles);
        var results = Papa.parse($scope.myFiles);
        console.log(results);
    };


    $scope.handler=function(e,files){
        var reader=new FileReader();
        reader.onload=function(e){
            var string=reader.result;
            //console.log(string);
            //var obj=$filter('csvToObj')(string);
            //console.log(obj);
            var results = Papa.parse(string,{
                header: true
            });
            console.log('1st', results);
        };
        reader.readAsText(files[0]);
        Papa.parse(files[0], {
            complete: function(results) {
                console.log('these results', results);
            }
        });
    };
    console.log($scope.categories)
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
//=======
//myApp.controller('AddClientController', ["$scope", "DataService", "$http", function($scope, DataService, $http){
//    console.log("Add client Controller Online");
//    //
//    //$scope.dataService = DataService;
//    //
//    ////$scope.newClient = {
//    ////
//    ////};
//    //
//    //$scope.categories = [];
//    //
//    //
//    //$scope.retrieveCategories = function(){
//    //    $http({
//    //        method: 'GET',
//    //        url: '/getcategories'
//    //    }).then(function(response) {
//    //        $scope.categories = response.data;
//    //        console.log("Here are the categories: ", $scope.categories);
//    //        console.log($scope.categories[0].category_name);
//    //    })
//    //};
//    //
//    //
//    //$scope.retrieveCategories();
//    //
//    ////$scope.submit = function(){
//    ////    console.log($scope.newClient)
//    ////};
//
//
//    //VALIDATION
//    $scope.submitForm = function() {
//
//        // check to make sure the form is completely valid
//        if ($scope.addClientForm.$valid) {
//            //alert('New client added!');
//            //post new client!
//            console.log($scope.client);
//            $scope.clearInput();
//        }
//    };
//
//    //Clear form input
//    $scope.clearInput = function() {
//        $scope.client = null;
//        $scope.addClientForm.$setUntouched();
//    };
//
//}]);
//>>>>>>> master
