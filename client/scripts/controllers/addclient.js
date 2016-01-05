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
            //$scope.newClient.password = $scope.newClient.phone.toString();
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

myApp.directive('isUnique', ['$http', function($http){
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

myApp.controller('ImportClientController', ["$scope", "$uibModalInstance", "$http", "DataService", function($scope, $uibModalInstance, $http, DataService){
    $scope.csvClients = undefined;
    $scope.clients = undefined;
    $scope.clientsAdded = false;
    $scope.dataService = DataService;
    $scope.categories = undefined;

    if ($scope.categories == undefined) {
        $scope.dataService.retrieveCategories().then(function(){
            $scope.categories = $scope.dataService.getCategories();
            //console.log($scope.categories);
        });
    }else{
        $scope.categories = $scope.dataService.getCategories();
    }

    if($scope.clients == undefined){
        $http.get('/register/all').then(function(response){
            $scope.clients = response.data;
            console.log('clients in db', $scope.clients);
        })
    }

    $scope.remove = function(){
        $scope.csvClients = undefined;
    };

    $scope.uploadFile = function(files){
        //var filename = files[0].name;
        //$scope.csvClients = ['stuff'];
        var config = {
            header: true,
            complete: function(results){
                $scope.csvClients = formatData(results.data);
                console.log('finished', $scope.csvClients);
                $scope.$apply();
            }
        };
        Papa.parse(files[0], config);
    };


    $scope.gridOptions = {
        data: 'csvClients',
        enableSorting: true,
        columnDefs: [
            {field: "first_name", displayName: 'First Name', enableCellEdit: false},
            {field: "last_name", displayName: 'Last Name', enableCellEdit: false},
            {field: "email", displayName: 'Email Address', enableCellEdit: false},
            {field: "phone", displayName: 'Phone Number', enableCellEdit: false},
            {field: "default_meal", displayName: 'Default Pack', enableCellEdit: false}
        ]
    };

    var formatData = function(rawData){
        rawData = _.uniq(rawData, 'Email');
        rawData = _.filter(rawData, function(entry){
            console.log('entry', entry);
           if(_.findWhere($scope.clients, {email: entry['Email']})){
               console.log('duplicate email!')
           }else{
               return entry;
           }
        });
        console.log('raw', rawData);
        var formattedData = [];

        //converts to friendlier data structure
        _.each(rawData, function(client){
            var getCategory = function(){
                var categoryArray = _.where($scope.categories, {category_name: client['Default Pack']});
                //console.log(categoryArray);
                if (categoryArray.length==0){
                    return $scope.categories[0];
                }
                return categoryArray[0];

            };
            var person = {
                email: client['Email'],
                first_name: client['First Name'],
                last_name: client['Last Name'],
                phone: client['Phone'],
                default_meal: getCategory().category_name,
                category_id: getCategory().category_id
            };
            //console.log(person);
            formattedData.push(person);
        });

        return formattedData;
    };

    $scope.post = function(){
        $http.post('/register/groupregister', $scope.csvClients).then(function(response){
            console.log(response);
            $scope.csvClients = undefined;
            $scope.clientsAdded = true;
        });
    }

}]);

myApp.directive('customOnChange', function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeFunc = scope.$eval(attrs.customOnChange);
            element.bind('change', function(event){
                var files = event.target.files;
                onChangeFunc(files);
            });

            element.bind('click', function(){
                element.val('');
            });
        }
    };
});

