myApp.controller('ViewMealController', ["$scope", "$http", "$uibModal", function($scope, $http, $uibModal){
    console.log("view meal Controller Online");
    $scope.allMeals = [];

    $scope.showAll = function(){
        $http.get('/getmeals/showAll').then(function(response){
            console.log("showall Response: ", response.data);
            $scope.allMeals = response.data;
        })
    };

    $scope.searchMeals = function(){
        console.log($scope.meal.searchTerm);
        $http.get('/getmeals/searchMeal', {params : {searchTerm : $scope.meal.searchTerm}}).then(function(response){
            console.log("search Meals Response:", response.data);
            $scope.allMeals = response.data;
        })
    };



    $scope.gridOptions = {
        data: 'allMeals',
        enableSorting: true,
        enableGridMenu: true,
        enableSelectAll: true,
        exporterMenuCsv: true,
        exporterMenuPdf: false,
        columnDefs: [
            {field: "entree", displayName: 'Entree', enableCellEdit: false},
            {field: "side_1", displayName: 'Side 1', enableCellEdit: false},
            {field: "side_2", displayName: 'Side 2', enableCellEdit: false},
            {field: "view", name: "view", displayName: 'View', cellTemplate: '<div class="ui-grid-cell-contents"><button ng-click="grid.appScope.viewMeal(row)">View</button></div>'},
            {field: "delete", name: "delete", displayName: 'Delete', cellTemplate: '<div class="ui-grid-cell-contents"><button ng-click="grid.appScope.deleteMeal(row)">Delete</button></div>'}
        ]
    };

    $scope.deleteMeal = function(row){
        console.log("delete Meal!");
        console.log(row);

        $scope.mealID = row.entity.meal_id;

        row.entity.status = false;

        $http.put('/getmeals/changeStatus',{meal_id : $scope.mealID}).then(function(response){
            console.log(response);
            $scope.allMeals = response.data;
        });

        console.log(row.entity);
    };

    $scope.viewMeal = function(row){
        console.log("view meal!");
        console.log(row);
        $scope.open('lg', row);
    };

    $scope.animationsEnabled = true;

    $scope.open = function (size, row) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: './templates/viewmealmodal.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                row: function(){
                    return row
                }

            }
        });

    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

}]);

myApp.controller('ModalInstanceCtrl', ["$scope", "$http", "$uibModalInstance", "row", function ($scope, $http, $uibModalInstance, row) {

    $scope.row = row;

    $scope.mealid = row.entity.meal_id;
    console.log($scope.mealid);

    $http.get('/getmeals/mealExtras', {params: {meal_id : $scope.mealid}}).then(function(response){
        console.log("mealExtras Response: ", response.data);
        $scope.displayData = response.data;
    });

    $scope.ok = function () {
        $uibModalInstance.close('close');
    };

}]);
