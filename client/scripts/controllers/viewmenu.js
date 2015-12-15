myApp.controller('ViewMenuController', ["$scope", "$http", "DataService", function($scope, $http, DataService){
    console.log("view menu Controller Online");

    // Declare Variables
    $scope.dataService = DataService;
    $scope.categories = $scope.dataService.getCategories();
    $scope.menuByWeek = $scope.dataService.getMenu();
    $scope.showCategoryHeadings = false;
    $scope.menu = {};
    $scope.allMeals = [];
    $scope.mealsInMenuArray = [];
    $scope.defaultMeal = [];

    // Pull in categories
    if($scope.categories == undefined){
        $scope.dataService.retrieveCategories().then(function(){
            $scope.categories = $scope.dataService.getCategories();
            $scope.getMeals();
        });
    } else {
        $scope.categories = $scope.dataService.getCategories();
        $scope.getMeals();
    }

    // GET meals for each category
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

            // Build menuPreBuild Object for storing meals for each category
            //for(var i = 0; i<$scope.categories.length; i++){
            //    $scope.menuPreBuild[$scope.categories[i].category_name] = [];
            //}

        });
    };

    $scope.getMenu = function(menu) {

        // Get Menu for Specific Week
        if ($scope.menuByWeek == undefined){
            $scope.dataService.retrieveMenuByWeek(menu.startDate, menu.endDate).then(function(){
                $scope.menuByWeek = $scope.dataService.getMenu();
                console.log($scope.menuByWeek);
                $scope.setDefault();
            });
        }else {
            $scope.menuByWeek = $scope.dataService.getMenu();
            console.log($scope.menuByWeek);
            $scope.setDefault();
        }

        $scope.showCategoryHeadings = true;

        //$http.get('/getmenu', {params: {startDate: menu.startDate, endDate: menu.endDate}}).then(function (response) {
        //    $scope.mealsInMenuArray = response.data;
        //    $scope.showCategoryHeadings = true;

            //for(var i = 0; i < $scope.categories.length; i++){
            //    $scope.categories[i].mealInfo = [];
            //
            //    for(var j = 0; j < $scope.mealsInMenuArray.length; j++){
            //
            //        // Push meal into object category based on category
            //        if($scope.categories[i].category_name == $scope.mealsInMenuArray[j].category_name){
            //            $scope.categories[i].mealInfo.push($scope.mealsInMenuArray[j]);
            //        }
            //    }
            //}




            //$scope.defaultMeal[0] = $scope.categories[0].mealInfo[0];

        //});
    };

    $scope.setDefault = function(){

        for(var i = 0; i < $scope.categories.length; i++){
            $scope.categories[i].defaultMeal = [];
            for(var j = 0; j < $scope.categories[i].mealInfo.length; j++){
                for(var k = 0; k < $scope.menuByWeek.length; k++){

                    if($scope.menuByWeek[k].meal_id == $scope.categories[i].mealInfo[j].meal_id &&
                        $scope.menuByWeek[k].category_id == $scope.categories[i].mealInfo[j].category_id){
                        console.log("JACKPOT!");
                            $scope.categories[i].defaultMeal.push($scope.categories[i].mealInfo[j]);
                    }
                }
            }
        }

        //$scope.defaultMeal[0] = $scope.categories[1].mealInfo[0];
    }


}]);