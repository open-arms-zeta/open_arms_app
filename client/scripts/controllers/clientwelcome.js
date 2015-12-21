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
    $scope.notActive = false;

    $scope.mealsWithAllergens = [];

    $scope.accordion = {current: null};
    $scope.addedMeal = [];

    //get user
    if ($scope.user == undefined) {
        $scope.dataService.retrieveUser().then(function(){
            $scope.user = $scope.dataService.getUser();
            $scope.checkClientStatus($scope.user);
        });
    } else {
        $scope.user = $scope.dataService.getUser();
        $scope.checkClientStatus($scope.user);

    }

    //pull in active week
    if ($scope.activeWeek == undefined) {
        $scope.dataService.calculateActiveWeek();
        $scope.activeWeek = $scope.dataService.getActiveWeek();
        $scope.activeWeek = new Date($scope.activeWeek.setHours(0,0,0,0));
    }else{
        $scope.activeWeek = $scope.dataService.getActiveWeek();
        $scope.activeWeek = new Date($scope.activeWeek.setHours(0,0,0,0))
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
        $scope.dataService.retrieveMenuByWeek($scope.activeWeek).then(function(){
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

        $http.get('/getmeals/allergenExtras', {params: {meal_id : $scope.menu[i].meal_id}}).then(function(response){

            for(var j = 0; j < response.data.length; j++){
                if(response.data[j].allergen_specific){
                    $scope.menu[i].allergen.push(response.data[j].allergen_name + '- ' +  response.data[j].allergen_specific);
                } else {
                    $scope.menu[i].allergen.push(response.data[j].allergen_name);
                }
            }

        });
    };


    // Check client status
    $scope.checkClientStatus = function(user){
        if(user.status == false){
            $scope.notActive = true;
        }
    };

    // ****************************************************
    //-------------------To do: check client orders for active week to see if user has already chosen meals
    // GET call to server passing client_id and menu_id
    // if response.data[0], $scope.mealsChosen = true


    //If user wishes to customize, this value is set to true
    $scope.customize = function(){
        $scope.customized = true;
    };

    //If user completes order, mealsChosen is set to true and the program is terminated

    //  This function runs when client confirms default meal selection
    $scope.postDefaultMeal = function(){

        console.log("User ID", $scope.user.id);
        console.log("menu ID", $scope.menu[0].menu_id);

        for(var i = 0; i < $scope.menu.length; i++){
            if($scope.user.category_id == $scope.menu[i].category_id){
                $scope.addedMeal.push({
                    clientId: $scope.user.id,
                    menuId: $scope.menu[0].menu_id,
                    mealId: $scope.menu[i].meal_id,
                    categoryId: $scope.menu[i].category_id,
                    count: 1
                });
            }
        }

        $http.post('/postclientorders/saveClientOrders', $scope.addedMeal).then(function(){
            console.log("post done");
        });

        // Format default meal choices into objects
        // ---- client_id
        // ---- menu_id
        // ---- meal_id
        // ---- category_id
        // ---- count
        // POST client order to database
        // ---- Need to post in a loop to post multiple lines

        $scope.mealsChosen = true;
        $scope.modalShown = !$scope.modalShown;
    };

    // Modal
    $scope.toggleModal = function() {
        $scope.modalShown = !$scope.modalShown;
    };

    $scope.toggleModal2 = function() {
        $scope.modalShown2 = !$scope.modalShown2;
    };

    // Add Custom Meal to Picnic Basket
    $scope.addMeal = function(meal){
        $scope.addedMeal.push(meal);
    };

    // Remove Custom Meal from Picnic Basket
    $scope.removeMeal = function(index){
        $scope.addedMeal.splice(index, 1);
    };

    // POST custom meals to Clients Order table
    $scope.postCustomMeal = function(){

        // NEED TO CHECK COUNT FOR EACH MEAL!!!!!!

        // Format meal choices into objects
        // ---- client_id (already have user.id)
        // ---- menu_id (already have menu.menu_id)
        // ---- meal_id
        // ---- category_id
        // ---- count

        // POST client order to database
        // ---- Need to post in a loop to post multiple lines

        $scope.mealsChosen = true;
        $scope.modalShown2 = !$scope.modalShown2;
    };

}]);

