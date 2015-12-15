myApp.controller('CreateMealController', ["$scope",  '$http', "DataService",  function($scope, $http, DataService){
    console.log("create meal Controller Online");


    $scope.meal = {
        categories: [],
        allergens: []
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
        //
        //});
        console.log($scope.mealtype);
        console.log($scope.allergy);
        console.log($scope.meal);
        //$scope.mealCreate();
    };

    $scope.findAllergen = function(allergen){
        var allergensInMeal = _.pluck($scope.meal.allergens, 'allergen_name');
        return _.contains(allergensInMeal, allergen);
    };

    $scope.associate = function(allergen, specificAllergen){
        var index = _.findLastIndex($scope.meal.allergens, {allergen_name: allergen});
        $scope.meal.allergens[index].specific = specificAllergen;
        //console.log($scope.meal);
    }
}]);