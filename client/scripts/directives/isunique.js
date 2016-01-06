myApp.directive('isUnique', ['$http', function($http){
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            element.on('keyup', function(){
                var entry = element[0].value;
                return $http.get('/register/all').then(function(response){
                    var clients = response.data;
                    if(_.findWhere(clients, {email: entry}) && entry.length >0){
                        console.log('true!');
                        ctrl.$setValidity('isunique', false);
                    }else{
                        console.log('false!');
                        ctrl.$setValidity('isunique', true);
                    }
                });
            });
        }
    };
}]);
