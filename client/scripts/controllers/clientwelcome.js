myApp.controller('ClientWelcomeController', ["$scope", "DataService", "$http", function($scope, DataService, $http){
    console.log("Client Welcome Controller Online");

    $scope.dataService = DataService;
    $scope.user = undefined;
    $scope.activeWeek = undefined;
    $scope.menu = undefined;
    $scope.categories = undefined;
    $scope.modalShown = false;
    $scope.modalShown2 = false;
    $scope.modalShown3 = false;
    $scope.showBasket = false;
    $scope.showMobileConfirmation = false;

    $scope.mealsChosen = false;
    $scope.customized = false;
    $scope.notActive = false;

    $scope.mealsWithAllergens = [];

    $scope.accordion = {current: null};
    $scope.addedMealArray = [];
    $scope.uniqueMealArray = [];
    $scope.orderToPost = [];
    $scope.orderedMealsArray = [];


    //$scope.mealAddedMessage = false;
    $scope.badgeNumber = 0;


    //get user
    if ($scope.user == undefined) {
        $scope.dataService.retrieveUser().then(function(){
            $scope.user = $scope.dataService.getUser();
            $scope.checkClientStatus($scope.user);
            $scope.checkNewUser($scope.user);
        });
    } else {
        $scope.user = $scope.dataService.getUser();
        $scope.checkClientStatus($scope.user);
        $scope.checkNewUser($scope.user);

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
            $scope.checkHasOrdered();
        });

    }else {
        $scope.menu = $scope.dataService.getMenu();
        $scope.matchAllergens();
        $scope.pushMenu();
        $scope.checkHasOrdered();
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
                    $scope.menu[i].allergen.push(response.data[j].allergen_name + ' - ' +  response.data[j].allergen_specific);
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

    // Check if client has used this app before
    $scope.checkNewUser = function(user){
        if(user.new_user){
            $scope.toggleModal3();

            // PUT to change new_user to false
            $http.put('/getclients/updateNewUser', {id: user.id}).then(function(){
               console.log("Change new_user to false");
            });
        }
    };

    // Check if client has already ordered!
    $scope.checkHasOrdered = function(){

        return $http.get('/getclients/checkOrdered', {params: {clientId: $scope.user.id, menuId: $scope.menu[0].menu_id}}).then(function(response){
           if (response.data[0]) {
               console.log("This person ordered...", response.data);
               $scope.orderedMealsArray = (response.data);
               console.log("This is orderedMealsArray", $scope.orderedMealsArray);
               $scope.mealsChosen = true;
               $scope.customized = false;
           }
        });
    };

    //If user wishes to customize, this value is set to true
    $scope.customize = function(){
        $scope.customized = true;
    };

    //If user completes order, mealsChosen is set to true and the program is terminated

    //  This function runs when client confirms default meal selection
    $scope.postDefaultMeal = function(){

        $scope.modalShown = !$scope.modalShown;

        for(var i = 0; i < $scope.menu.length; i++){
            if($scope.user.category_id == $scope.menu[i].category_id){
                $scope.orderToPost.push({
                    clientId: $scope.user.id,
                    menuId: $scope.menu[0].menu_id,
                    mealId: $scope.menu[i].meal_id,
                    categoryId: $scope.menu[i].category_id,
                    count: 1
                });
            }
        }

        return $http.post('/postclientorders/saveClientOrders', $scope.orderToPost).then(function(){
            $scope.checkHasOrdered();
        });

    };

    // Modal for default
    $scope.toggleModal = function(){
        $scope.modalShown = !$scope.modalShown;
    };

    // Modal for customize meals
    $scope.toggleModal2 = function(){
        $scope.modalShown2 = !$scope.modalShown2;
    };

    // Modal for Instructions
    $scope.toggleModal3 = function(){
        $scope.modalShown3 = !$scope.modalShown3;
    };

    $scope.toggleBasket = function(){
        $scope.showBasket = !$scope.showBasket;
    };

    $scope.toggleBasketSubmission = function(){
        $scope.showMobileConfirmation = !$scope.showMobileConfirmation;
        $scope.showBasket = !$scope.showBasket;
    };

    // Add Custom Meal to Picnic Basket
    $scope.addMeal = function(meal){
        $scope.addedMealArray.push(meal);
        //$scope.mealAddedMessage = true;
        $scope.badgeNumber = $scope.addedMealArray.length;
    };

    // Remove Custom Meal from Picnic Basket
    $scope.removeMeal = function(index){
        $scope.addedMealArray.splice(index, 1);
        $scope.badgeNumber = $scope.addedMealArray.length;
    };

    // POST custom meals to Clients Order table
    $scope.postCustomMeal = function(){

        $scope.uniqueMealArray = _.uniq($scope.addedMealArray);

        // Create orderToPost array with uniqueMealArray information
        for(var i = 0; i < $scope.uniqueMealArray.length; i++) {
            $scope.orderToPost.push({
                clientId: $scope.user.id,
                menuId: $scope.menu[0].menu_id,
                mealId: $scope.uniqueMealArray[i].meal_id,
                categoryId: $scope.uniqueMealArray[i].category_id,
                count: 0
            });
        }

        // Compare uniqueMealArray and addedMealArray for duplicates
        for(var i = 0; i < $scope.uniqueMealArray.length; i++) {
            for (var j = 0; j < $scope.addedMealArray.length; j++){

                if($scope.uniqueMealArray[i].meal_id == $scope.addedMealArray[j].meal_id &&
                    $scope.uniqueMealArray[i].category_id == $scope.addedMealArray[j].category_id){

                    // Add to count in orderToPost for number of each meal selected
                    $scope.orderToPost[i].count += 1;

                }
            }

        }

        $http.post('/postclientorders/saveClientOrders', $scope.orderToPost).then(function(){
            $scope.checkHasOrdered();
        });

        $scope.modalShown2 = !$scope.modalShown2;
    };

    $scope.backToHome = function(){
        $scope.customized = false;
        $scope.modalShown3 = false;
    };

}]);

