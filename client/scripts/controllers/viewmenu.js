myApp.controller('ViewMenuController', ["$scope", "$http", "DataService", function($scope, $http, DataService){
    console.log("view menu Controller Online");

    // Declare Variables
    $scope.dataService = DataService;
    //$scope.categories = $scope.dataService.getCategories();
    //$scope.menuByWeek = $scope.dataService.getMenu();
    $scope.showCategoryHeadings = false;
    $scope.menu = {};
    $scope.allMeals = [];
    $scope.mealsInMenuArray = [];
    $scope.defaultMeal = [];
    $scope.menuPreBuild = {};
    $scope.selectedMealArray = [];
    $scope.menuId;
    $scope.hideDropDown = true;
    $scope.weekNumber;

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

    // GET all meals for each category
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
            for(var i = 0; i<$scope.categories.length; i++){
                $scope.menuPreBuild[$scope.categories[i].category_name] = [];
            }

        });
    };

    $scope.getMenu = function(menu) {
        $scope.hideDropDown = true;

        // Get Menu for Specific Week
        $scope.categories = $scope.dataService.getCategories();
        $scope.dataService.retrieveMenuByWeek(menu.startDate, menu.endDate).then(function(){
            $scope.menuByWeek = $scope.dataService.getMenu();
            $scope.menuId = $scope.menuByWeek[0].menu_id;
            $scope.weekNumber = $scope.menuByWeek[0].week_number;
            console.log($scope.menuByWeek, $scope.menuId, $scope.weekNumber);
            $scope.setDefault();
        });

        $scope.showCategoryHeadings = true;

    };

    // Show Previously Saved Menu meal items as default options in drop down menu
    $scope.setDefault = function(){
        for(var i = 0; i < $scope.categories.length; i++){
            $scope.categories[i].defaultMeal = [];

            for(var j = 0; j < $scope.categories[i].mealInfo.length; j++){

                for(var k = 0; k < $scope.menuByWeek.length; k++){

                    if($scope.menuByWeek[k].meal_id == $scope.categories[i].mealInfo[j].meal_id &&
                        $scope.menuByWeek[k].category_id == $scope.categories[i].mealInfo[j].category_id){

                        $scope.categories[i].defaultMeal.push($scope.categories[i].mealInfo[j]);
                        $scope.menuPreBuild[$scope.categories[i].category_name] = $scope.categories[i].defaultMeal;
                    }
                }
            }
        }
    };

    // Save selected meals from drop down menus to menuPreBuild (this allows changes before clicking submit button)
    $scope.saveMeals = function(currentMeal, category, index){
        $scope.menuPreBuild[category][index] = currentMeal;
        //console.log($scope.menuPreBuild);
    };

    // This function runs when the "Edit Menu" button is clicked
    $scope.createMenu = function(menu){
        //console.log(menu);

        // Push all objects in menuPreBuild to selectedMealArray as one array of objects (using UnderscoreJS)
        $scope.selectedMealArray = (_.flatten(_.values($scope.menuPreBuild)));
        //console.log($scope.selectedMealArray);

        // Delete meal_id and category_id columns of the current editing menu
        $http.delete('/getmenu/removeMealsFromMenu', {params: {menuId: $scope.menuId}}).then(function(){

            $scope.postToMealMenu();

        });

    };

    $scope.postToMealMenu = function(){
        $http.post('/createmenu/saveToMealMenu', {menuId: $scope.menuId, mealsArray: $scope.selectedMealArray}).then(function(){
            console.log("HI");
            $scope.hideDropDown = false;
            $scope.showCategoryHeadings = false;
        });
    };


}]);