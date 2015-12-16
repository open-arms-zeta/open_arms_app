myApp.controller('CreateMenuController', ["$scope", "$http", "DataService", function($scope, $http, DataService){
    console.log("create menu Controller Online");

    // Declare Variables
    $scope.dataService = DataService;
    $scope.allMeals = [];
    $scope.mealByCategory = {};
    $scope.allergens = [];
    $scope.selectedMealArray = [];
    $scope.menu = {};
    $scope.menuId;
    $scope.menuPreBuild = {};

    // Pull in categories
    if ($scope.categories == undefined) {
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
            for(var i = 0; i<$scope.categories.length; i++){
                $scope.menuPreBuild[$scope.categories[i].category_name] = [];
            }

        });
    };

    // Save selected meals from drop down menus to menuPreBuild (this allows changes before clicking submit button)
    $scope.saveMeals = function(currentMeal, category, index){
        $scope.menuPreBuild[category][index] = currentMeal;
    };

    $scope.createMenu = function(menu){
        //console.log(menu);

        // Push all objects in menuPreBuild to selectedMealArray as one array of objects
        $scope.selectedMealArray = (_.flatten(_.values($scope.menuPreBuild)));
        //console.log($scope.selectedMealArray);

        // POST to create new menu entry in menus table
        $http.post('/createmenu/newMenu', menu).then(function(){

            // GET menu_id of the new entry based on date
            $scope.getMenuId(menu);

        });
    };

    $scope.getMenuId = function(menu){

        $http.get('/createmenu/getMenuId', {params: {startDate: menu.startDate}}).then(function(response){
            $scope.menuId = response.data[0].menu_id;

            // POST menu_id, meal_id, and category_id to meal_menu table
            $scope.postToMealMenu();

        });
    };

    $scope.postToMealMenu = function(){
        $http.post('/createmenu/saveToMealMenu', {menuId: $scope.menuId, mealsArray: $scope.selectedMealArray}).then(function(){
            console.log("HI");
        });
    };

}]);