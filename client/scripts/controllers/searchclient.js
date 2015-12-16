myApp.controller('SearchClientController', ["$scope", "DataService", "$http", function($scope, DataService, $http){
    console.log("search client Controller Online");
    $scope.clientData = undefined;
    $scope.search = "";

    $scope.retrieveAll = function(){
        $http.get('searchclients/all').then(function(response){
            console.log(response.data);
            $scope.clientData = response.data;
        })
    };

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

    $scope.gridOptions = {
        data: 'clientData',
        enableSorting: true,
        columnDefs: [
        {field: "first_name", displayName: 'First Name', enableCellEdit: false},
        {field: "last_name", displayName: 'Last Name', enableCellEdit: false},
        {field: "email", displayName: 'Email Address', enableCellEdit: false},
        {field: "phone", displayName: 'Phone Number', enableCellEdit: false},
        {field: "default_meal", displayName: 'Default Pack', enableCellEdit: false},
        {field: "status", displayName: 'Active Status',  type: 'boolean', cellTemplate: '<div ng-show="row.entity.status"><input type="checkbox" ng-model="row.entity.status"> Active</div>' +
        '<div ng-hide="row.entity.status"><input type="checkbox" ng-model="row.entity.status"> Inactive</div>',
            editableCellTemplate: '<div ng-show="row.entity.status"><input type="checkbox" ng-model="row.entity.status"> Active</div>' +
        '<div ng-hide="row.entity.status"><input type="checkbox" ng-model="row.entity.status"> Inactive</div>'}
        ]
    };

    $scope.updateOrders = function(){
        console.log($scope.clientData);
        //Some code to update the update orders
    };

    $scope.retrieveAll();
}]);

