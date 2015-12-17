myApp.controller('ViewMenuController', ["$scope", "$http", "DataService", function($scope, $http, DataService){
    console.log("view menu Controller Online");

    // Declare Variables
    $scope.dataService = DataService;
    $scope.showCategoryHeadings = false;
    $scope.menu = {};
    $scope.allMeals = [];
    $scope.mealsInMenuArray = [];
    $scope.defaultMeal = [];
    $scope.menuPreBuild = {};
    $scope.selectedMealArray = [];
    $scope.menuId;
    $scope.hideDropDown = true;
    $scope.hideEditSuccessMessage = true;
    $scope.weekNumber;
    $scope.activeWeek = undefined;
    $scope.disableDropDown = false;
    $scope.noMenuMessage = false;
    $scope.oldMenuMessage = false;

    //pull in active week
    if ($scope.activeWeek == undefined) {
        $scope.dataService.calculateActiveWeek();
        $scope.activeWeek = $scope.dataService.getActiveWeek();
        console.log($scope.activeWeek);
    } else {
        $scope.activeWeek = $scope.dataService.getActiveWeek();

    }

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

    // This function runs when view menu button is clicked
    $scope.getMenu = function(menu) {

        // Reset all messages and disables
        $scope.hideDropDown = true;
        $scope.hideEditSuccessMessage = true;
        $scope.disableDropDown = false;
        $scope.noMenuMessage = false;
        $scope.oldMenuMessage = false;

        if($scope.menu.startDate <= $scope.activeWeek){
            //console.log("Hi");
            $scope.disableDropDown = true;
            $scope.oldMenuMessage = true;

        }

        // Check if menu exists
        $http.get('/createmenu/getMenuId', {params: {startDate: menu.startDate}}).then(function(response){
            console.log(response.data);
            if (response.data[0] == null){

                console.log("this menu does not exist");
                $scope.noMenuMessage = true;
                $scope.disableDropDown = true;


            } else {

                // Get Menu for Specific Week
                $scope.hideDropDown = false;
                $scope.categories = $scope.dataService.getCategories();
                $scope.dataService.retrieveMenuByWeek(menu.startDate, menu.endDate).then(function(){
                    $scope.menuByWeek = $scope.dataService.getMenu();
                    $scope.menuId = $scope.menuByWeek[0].menu_id;
                    $scope.weekNumber = $scope.menuByWeek[0].week_number;
                    console.log($scope.menuByWeek, $scope.menuId, $scope.weekNumber);
                    $scope.setDefault();
                });

                $scope.showCategoryHeadings = true;

            }

        });

        //// Get Menu for Specific Week
        //$scope.categories = $scope.dataService.getCategories();
        //$scope.dataService.retrieveMenuByWeek(menu.startDate, menu.endDate).then(function(){
        //    $scope.menuByWeek = $scope.dataService.getMenu();
        //    $scope.menuId = $scope.menuByWeek[0].menu_id;
        //    $scope.weekNumber = $scope.menuByWeek[0].week_number;
        //    console.log($scope.menuByWeek, $scope.menuId, $scope.weekNumber);
        //    $scope.setDefault();
        //});
        //
        //$scope.showCategoryHeadings = true;

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
            $scope.hideEditSuccessMessage = false;
            $scope.showCategoryHeadings = false;
        });
    };



    //// Bootstrap UI Date Picker ////

    //$scope.today = function() {
    //    $scope.menu.startDate = null;
    //};
    //$scope.today();
    //
    //$scope.clear = function () {
    //    $scope.menu.startDate = null;
    //};

    // Disable dates selection
    $scope.disabled = function(date, mode) {

        // Disable days before today, non-Mondays, and dates before active week
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() > 1));
    };

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();
    $scope.maxDate = new Date(2020, 5, 22);

    $scope.open = function($event) {
        $scope.status.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.menu.startDate = new Date(year, month, day);
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 0
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'MM/dd/yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];

    $scope.status = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 2);
    $scope.events =
        [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

    $scope.getDayClass = function(date, mode) {
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i=0;i<$scope.events.length;i++){
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    };

}]);