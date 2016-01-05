myApp.controller('ViewMealController', ["$scope", "$http", "$uibModal", function($scope, $http, $uibModal){
    console.log("view meal Controller Online");
    $scope.search = undefined;
    $scope.allMeals = [];

    $scope.showAll = function(){
        $http.get('/getmeals/showAll').then(function(response){
            console.log("showall Response: ", response.data);
            $scope.allMeals = response.data;
        })
    };

    $scope.getSearchResults = function(){
        console.log($scope.search);
        if($scope.search.length > 0){
            $http.get('/getmeals/searchMeal', {params : {searchTerm : $scope.search}}).then(function(response){
                console.log("search Meals Response:", response.data);
                $scope.allMeals = response.data;
                $scope.search = "";
            })
        }else{
            $scope.showAll();
        }
    };



    $scope.gridOptions = {
        data: 'allMeals',
        rowHeight: 40,
        enableSorting: true,
        //enableGridMenu: true,
        //enableSelectAll: true,
        //exporterMenuCsv: true,
        //exporterMenuPdf: false,
        columnDefs: [
            {field: "entree", displayName: 'Entree', enableCellEdit: false},
            {field: "side_1", displayName: 'Side 1', enableCellEdit: false},
            {field: "side_2", displayName: 'Side 2', enableCellEdit: false},
            {field: "view", name: "view", displayName: 'View', cellClass: 'ui-grid-vcenter',cellTemplate: '<div class="ui-grid-cell-contents"><button ng-click="grid.appScope.viewMeal(row)" class="custom-button-ui-grid">View</button></div>'},
            {field: "delete", name: "delete", displayName: 'Delete', cellClass: 'ui-grid-vcenter', cellTemplate: '<div class="ui-grid-cell-contents"><button ng-click="grid.appScope.deleteMeal(row)" class="custom-button-ui-grid">Delete</button></div>'}
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


    $scope.open = function (size, row) {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/assets/views/templates/viewmealmodal.html',
            controller: 'ViewMealModalController',
            size: size,
            resolve: {
                row: function(){
                    return row
                }

            }
        });

        modalInstance.result.then(function(){
            console.log('closed');
        })

    };


    $scope.showAll();
}]);



