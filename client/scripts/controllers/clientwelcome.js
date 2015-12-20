myApp.controller('ClientWelcomeController', ["$scope", "DataService", "$http", function($scope, DataService, $http){
    console.log("Client Welcome Controller Online");

    $scope.dataService = DataService;
    $scope.user = undefined;
    $scope.activeWeek = undefined;
    $scope.menu = undefined;
    $scope.categories = undefined;
    $scope.modalShown = false;
    $scope.modalShown2 = false;

    $scope.mealsChosen = false;
    $scope.customized = false;

    $scope.mealsWithAllergens = [];

    $scope.accordion = {current: null};
    $scope.addedMeal = [];

    //get user
    if ($scope.user == undefined) {
        $scope.dataService.retrieveUser().then(function(){
            $scope.user = $scope.dataService.getUser();
        });
    } else {
        $scope.user = $scope.dataService.getUser();

    }

    //pull in active week
    if ($scope.activeWeek == undefined) {
        $scope.dataService.calculateActiveWeek();
        $scope.activeWeek = $scope.dataService.getActiveWeek();
    }else{
        $scope.activeWeek = $scope.dataService.getActiveWeek()
    }

    //pull in categories
    if ($scope.categories == undefined) {
        $scope.dataService.retrieveCategories().then(function(){
            $scope.categories = $scope.dataService.getCategories();
        });
    }else{
        $scope.categories = $scope.dataService.getCategories();
    }

    //pulls in menu
    if ($scope.menu == undefined) {
        $scope.dataService.retrieveMenuByWeek("2016-01-04").then(function(){
            $scope.menu = $scope.dataService.getMenu();
            console.log("This is menu", $scope.menu);
            console.log("This is active week", $scope.activeWeek);
            $scope.matchAllergens();
            $scope.pushMenu();
        });

    }else {
        $scope.menu = $scope.dataService.getMenu();
        $scope.matchAllergens();
        $scope.pushMenu();
    }


    // Push meals into their corresponding categories
    $scope.pushMenu = function(){
        for(var i = 0; i < $scope.categories.length; i++){
            $scope.categories[i].mealInfo = [];

            for(var j = 0; j < $scope.menu.length; j++){

                // Push meal into object category based on category
                if($scope.categories[i].category_name == $scope.menu[j].category_name){
                    $scope.categories[i].mealInfo.push($scope.menu[j]);
                }
            }
            //console.log($scope.categories);
        }
    };

    $scope.matchAllergens = function(){
        for(var i = 0; i < $scope.menu.length; i++){
            $scope.getAllergen(i);
        }
        console.log($scope.menu);
    };

    $scope.getAllergen = function(i){
        $scope.menu[i].allergen=[];
        //console.log($scope.menu[i]);
        //console.log('outside get', $scope.menu[i]);
        $http.get('/getmeals/allergenExtras', {params: {meal_id : $scope.menu[i].meal_id}}).then(function(response){
            //console.log('this is i', i);
            //
            //console.log('inside get', $scope.menu[i]);
            //console.log("mealExtras Response: ", response.data);
            for(var j = 0; j < response.data.length; j++){
                if(response.data[j].allergen_specific){
                    $scope.menu[i].allergen.push(response.data[j].allergen_name + '- ' +  response.data[j].allergen_specific);
                } else {
                    $scope.menu[i].allergen.push(response.data[j].allergen_name);
                }
            }

        });
    };


    //If user wishes to customize, this value is set to true
    $scope.customize = function(){
        $scope.customized = true;
    };

    //If user completes order, this value is set to true and the program is terminated
    //-------------------To do: check client orders for active week to see if user has already chosen meals
    $scope.defaultOrder = function(){
        //$scope.mealsChosen = true;
        //$scope.toggleModal();
    };

    // Modal
    $scope.toggleModal = function() {
        $scope.modalShown = !$scope.modalShown;
    };

    $scope.toggleModal2 = function() {
        $scope.modalShown2 = !$scope.modalShown2;
    };

    $scope.addMeal = function(meal){
        $scope.addedMeal.push(meal);
    };

    $scope.removeMeal = function(index){
        $scope.addedMeal.splice(index, 1);
    };


}]);

