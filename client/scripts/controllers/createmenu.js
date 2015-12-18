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
    $scope.hideDropDown = false;
    $scope.activeWeek = undefined;
    $scope.menuExist = false;
    $scope.showSaveSuccessMessage = false;

    //pull in active week
    if ($scope.activeWeek == undefined) {
        $scope.dataService.calculateActiveWeek();
        $scope.activeWeek = $scope.dataService.getActiveWeek();

    } else {
        $scope.activeWeek = $scope.dataService.getActiveWeek();

    }

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
            console.log($scope.allMeals);

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

    // Check if a menu is already created for the selected startDate
    $scope.checkExistingMenu = function(startDate){

        // Reset
        $scope.menuExist = false;
        $scope.hideDropDown = false;

        // call get menu function (factory)
        $http.get('/createmenu/getMenuId', {params: {startDate: startDate}}).then(function(response){

            if (response.data[0] != null){
                console.log("this menu already exist");
                $scope.menuExist = true;
                $scope.hideDropDown = true;
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

            console.log("This is menu start date", menu.startDate);

            $scope.menuId = response.data[0].menu_id;

            // POST menu_id, meal_id, and category_id to meal_menu table
            $scope.postToMealMenu();

        });
    };

    $scope.postToMealMenu = function(menu){
        $http.post('/createmenu/saveToMealMenu', {menuId: $scope.menuId, mealsArray: $scope.selectedMealArray}).then(function(){
            console.log("menu saved");
            $scope.hideDropDown = true;
            $scope.showSaveSuccessMessage = true;
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
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() > 1 || date.setHours(0,0,0,0) <= $scope.activeWeek.setHours(0,0,0,0)));
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