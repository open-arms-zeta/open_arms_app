myApp.controller('ViewMealModalController', ["$scope", "$http", "$uibModalInstance", "row",  function ($scope, $http, $uibModalInstance, row) {

    $scope.row = row;

    $scope.mealid = row.entity.meal_id;
    console.log($scope.mealid);

    $http.get('/getmeals/mealExtras', {params: {meal_id : $scope.mealid}}).then(function(response){
        console.log("mealExtras Response: ", response.data);
        $scope.displayData = response.data;
    });

    $scope.ok = function () {
        $uibModalInstance.close('close');
    };

}]);

myApp.filter('unique', function () {

    return function (items, filterOn) {

        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});
