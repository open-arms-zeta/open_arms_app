myApp.controller('CreateMenuController', ["$scope", "$http", "DataService", function($scope, $http, DataService){
    console.log("create menu Controller Online");

    // Declare Variables
    $scope.dataService = DataService;
    $scope.allMeals = [];
    $scope.mealByCategory = {};
    $scope.allergens = [];
    $scope.categories = $scope.dataService.getCategories();
    $scope.selectedMealArray = [];

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
        });
    };

    $scope.saveMenu = function(currentMeal){
        //console.log(currentMeal);
        $scope.selectedMealArray.push(currentMeal);
        //console.log($scope.selectedMealArray);
    };

    $scope.createMenu = function(menu){
        console.log(menu);

        for(var i=0; i<$scope.selectedMealArray.length;i++){
            console.log($scope.selectedMealArray[i].meal_id, $scope.selectedMealArray[i].category_id);
        }
        $http.post('/createmenu', menu).then(function(){

            // GET menu_id of the new entry

            // POST send menu_id and $scope.selectedMealArray to Server
            // Let server run the loop

            //for(var i=0; i<$scope.selectedMealArray.length;i++){
            //    console.log($scope.selectedMealArray[i].meal_id, $scope.selectedMealArray[i].category_id);
            //}


        });
    }

}]);