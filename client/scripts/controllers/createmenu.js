myApp.controller('CreateMenuController', ["$scope", "$http", "DataService", function($scope, $http, DataService){
    console.log("create menu Controller Online");

    // Declare Variables
    $scope.dataService = DataService;
    $scope.allMeals = [];
    $scope.mealByCategory = {};
    $scope.categories = $scope.dataService.getCategories();

    //pull in categories
    if ($scope.categories == undefined) {
        $scope.dataService.retrieveCategories().then(function(){
            $scope.categories = $scope.dataService.getCategories();
        });
    }else{
        $scope.categories = $scope.dataService.getCategories();
    }

    // get meals for each category
    $http.get('/createmenu').then(function(response){
        //console.log(response.data);
        $scope.allMeals = response.data;

        for(var i = 0; i < $scope.categories.length; i++){
            $scope.categories[i].mealInfo = [];
            for(var j = 0; j < $scope.allMeals.length; j++){

                if($scope.categories[i].category_name == $scope.allMeals[j].category_name){

                    //console.log($scope.categories[i].category_name);
                    //$scope.mealByCategory.push($scope.allMeals[j]);

                    //$scope.mealByCategory[$scope.categories[i].category_name].push($scope.allMeals[j]);
                    $scope.categories[i].mealInfo.push($scope.allMeals[j]);
                }
            }
        }

        console.log($scope.categories);

    });
}]);