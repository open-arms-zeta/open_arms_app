myApp.controller('SearchClientController', ["$scope", "DataService", "$http", function($scope, DataService, $http){
    console.log("search client Controller Online");
    $scope.clientData = undefined;
    $scope.search = "";

    //retrieves all clients in the database
    $scope.retrieveAll = function(){
        $http.get('/searchclients/all').then(function(response){
            console.log(response.data);
            $scope.clientData = response.data;
        })
    };

    //retrieves clients based on a query, if query is empty all clients are returned
    $scope.getSearchResults = function(){
        if ($scope.search.length == 0){
            $scope.retrieveAll();
        }else{
            console.log($scope.search);
            $http.get('/searchclients', {params: {name: $scope.search}}).then(function(response){
                console.log(response.data);
                $scope.clientData = response.data;
            });
            $scope.search = "";
        }
    };

    //Configuration of the UI grid
    $scope.gridOptions = {
        data: 'clientData',
        enableSorting: true,
        columnDefs: [
        {field: "first_name", displayName: 'First Name', enableCellEdit: false},
        {field: "last_name", displayName: 'Last Name', enableCellEdit: false},
        {field: "email", displayName: 'Email Address', enableCellEdit: false},
        {field: "phone", displayName: 'Phone Number', enableCellEdit: false},
        {field: "default_meal", displayName: 'Default Pack', enableCellEdit: false},
        {field: "status", displayName: 'Active Status',  type: 'boolean', cellTemplate: '<div ng-show="row.entity.status"><input type="checkbox" ng-model="row.entity.status" ng-click="grid.appScope.updateRow(row)"> Active</div>' +
        '<div ng-hide="row.entity.status"><input type="checkbox" ng-model="row.entity.status" ng-click="grid.appScope.updateRow(row)"> Inactive</div>',
            editableCellTemplate: '<div ng-show="row.entity.status"><input type="checkbox" ng-model="row.entity.status" ng-click="grid.appScope.updateRow(row)"> Active</div>' +
        '<div ng-hide="row.entity.status"><input type="checkbox" ng-model="row.entity.status" ng-click="grid.appScope.updateRow(row)"> Inactive</div>'}
        ]
    };

    //THIS CODE makes a put to the database to update client information
    $scope.updateClients = function(){
        console.log($scope.clientData);
        //Some code to update the update orders
    };

    $scope.updateRow = function(row){
        var updatedClient = row.entity;
        $http.put('/searchclients/update', updatedClient).then(function(response){
            console.log(response.data);
        });
        //console.log(row)
    };

    $scope.retrieveAll();
}]);

