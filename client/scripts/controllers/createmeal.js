myApp.controller('CreateMealController', ["$scope",  '$http', "DataService",  function($scope, $http, DataService){
    console.log("create meal Controller Online");



    $scope.mealEntrySuccess = false;
    $scope.meal = {
        categories: [],
        allergens: [],
        status: true
    };
    $scope.mealID;

    //CATEGORIES PRESENTED FOR SELECTION
    $scope.mealCategories = function(){
        $http({
            method: 'GET',
            url: '/getcategories'
        }).then(function(response){
            console.log("categories",response.data);
            $scope.categories = response.data;
        });
    };
    $scope.mealCategories();

    //ALLERGEN PRESENTED FOR SELECTION
    $scope.mealAllergens = function(){
        $http({
            method: 'GET',
            url: "/getallergens"
        }).then(function(response){
            console.log("allergy", response.data);
            $scope.allergens = response.data;
        });
    };
    $scope.mealAllergens();


    //SEND NEW MEAL AND ALLERGEN SELECTION TO DB
    $scope.submit = function(){
        console.log('here is the meal', $scope.meal);
        $http({
            method: 'POST',
            url: '/postmeals/saveToMealsTable',
            data: $scope.meal
        }).then (function(response){
            $scope.newMealID();
            $scope.mealEntrySuccess = true;

        });

    };

    $scope.refreshForm = function() {
        $scope.mealEntrySuccess = false;
    };

    $scope.refreshForm();

    //NEW MEAL_ID NEWLY CREATED MEAL
    $scope.newMealID = function(){
        $http({
            method: 'GET',
            url: "/postmeals/getNewMealID"
        }).then(function(response){
            console.log("This is the mealID coming back", response.data[0]);
            //$scope.meal = response.data;
            $scope.mealId = response.data[0].meal_id;

            // Call function to post meal_id, category_id into meal_category table
            $scope.postToMealCategory();

            // Call function to post info into meal_allergens_allergenspecific table
            $scope.postToAllergens();
            $scope.clearInput();
        });
    };

    $scope.postToMealCategory = function(){
        $http({
            method: 'POST',
            url: "/postmeals/postToMealCategory",
            data: {mealId: $scope.mealId, mealObject: $scope.meal}
        }).then(function(){

        });
    };

    $scope.postToAllergens = function(){
        $http({
            method: 'POST',
            url: "/postmeals/postToAllergens",
            data: {mealId: $scope.mealId, mealObject: $scope.meal}
        }).then(function(){

        });
    };


    $scope.clearInput = function() {
        $scope.meal = {};
        $scope.createMeal.$setUntouched();
    };

    $scope.findAllergen = function(allergen){
        var allergensInMeal = _.pluck($scope.meal.allergens, 'allergen_name');
        return _.contains(allergensInMeal, allergen);
    };

    $scope.associate = function(allergen, specificAllergen){
        var index = _.findLastIndex($scope.meal.allergens, {allergen_name: allergen});
        $scope.meal.allergens[index].specific = specificAllergen;
    };

    $scope.ifNoAllergen = function(allergen) {
        if (allergen.allergen_name != "No Allergen" && _.findWhere($scope.meal.allergens, {allergen_name : "No Allergen"})) {
            console.log(_.findWhere($scope.allergens, {allergen_name : "No Allergen"}));
            $scope.meal.allergens = [_.findWhere($scope.allergens, {allergen_name : "No Allergen"})];
            return false;
        }
        return true;
    };




}]);