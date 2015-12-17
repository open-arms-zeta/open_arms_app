myApp.controller('CreateMealController', ["$scope",  '$http', "DataService",  function($scope, $http, DataService){
    console.log("create meal Controller Online");


    $scope.meal = {
        categories: [],
        allergens: [],
        status: true
    };

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
    $scope.submit = function(request){
        console.log("submitr", request);
        console.log('here is the meal', $scope.meal);
        //$http({
        //    method: 'POST',
        //    url: '/postmeals'
        //}).then (function(req){
        //$scope.clearInput();
        //
        //});

        console.log($scope.meal);

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
        //console.log($scope.meal);
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