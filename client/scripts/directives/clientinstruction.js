myApp.directive('instructions',
    function(){
        return {
            restrict: "E",
            scope: {
                info: "="
            },
            templateUrl: "/assets/views/templates/clientinstruction.html"
        }
    }
);