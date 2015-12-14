myApp.controller('CreateMenuController', ["$scope", "$http", "DataService", function($scope, $http, DataService){
    console.log("create menu Controller Online");

    // Declare Variables
    $scope.dataService = DataService;
    $scope.allMeals = [];
    $scope.mealByCategory = {};
    $scope.allergens = [];
    $scope.categories = $scope.dataService.getCategories();
    $scope.currentMealArray = [];

    //pull in categories
    if ($scope.categories == undefined) {
        $scope.dataService.retrieveCategories().then(function(){
            $scope.categories = $scope.dataService.getCategories();
            $scope.getMeals();
        });
    }else{
        $scope.categories = $scope.dataService.getCategories();
        $scope.getMeals();
    }

    // get meals for each category (excluding allergen information)
    $scope.getMeals = function(){
        $http.get('/createmenu/meals').then(function(response){
            $scope.allMeals = response.data;

            for(var i = 0; i < $scope.categories.length; i++){
                $scope.categories[i].mealInfo = [];

                for(var j = 0; j < $scope.allMeals.length; j++){

                    // Push meal into object category based on category
                    if($scope.categories[i].category_name == $scope.allMeals[j].category_name){
                        $scope.categories[i].mealInfo.push($scope.allMeals[j]);
                    }
                }
            }

            // get allergen information for each meal
            //for(i = 0; i < $scope.categories.length; i++){
            //    for(j = 0; j < $scope.categories[i].mealInfo.length; j++) {
            //        $http.get('/createmenu/allergens', {params: {mealId: $scope.categories[i].mealInfo[j].meal_id}}).then(function(response){
            //            for(k = 0; k < response.data.length; k++){
            //                $scope.allergens.push(response.data[k]);
            //            }
            //        });
            //    }
            //}

        });
    };

    $scope.saveMenu = function(currentMeal){
      console.log(currentMeal);
        $scope.currentMealArray.push(currentMeal);
        console.log($scope.currentMealArray);
    };

}]);