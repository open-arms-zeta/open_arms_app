myApp.controller('ImportClientController', ["$scope", "$uibModalInstance", "$http", "DataService", function($scope, $uibModalInstance, $http, DataService){
    console.log('controller on');
    $scope.csvClients = undefined;
    $scope.clients = undefined;
    $scope.clientsAdded = false;
    $scope.dataService = DataService;
    $scope.categories = undefined;

    if ($scope.categories == undefined) {
        $scope.dataService.retrieveCategories().then(function(){
            $scope.categories = $scope.dataService.getCategories();
            //console.log($scope.categories);
        });
    }else{
        $scope.categories = $scope.dataService.getCategories();
    }

    if($scope.clients == undefined){
        $http.get('/register/all').then(function(response){
            $scope.clients = response.data;
            console.log('clients in db', $scope.clients);
        })
    }

    $scope.remove = function(){
        $scope.csvClients = undefined;
    };

    $scope.uploadFile = function(files){
        //var filename = files[0].name;
        //$scope.csvClients = ['stuff'];
        console.log('doing stuff')
        var config = {
            header: true,
            complete: function(results){
                console.log('alkjsdf')
                $scope.csvClients = formatData(results.data);
                console.log('finished', $scope.csvClients);
                $scope.$apply();
            }
        };
        Papa.parse(files[0], config);
    };


    $scope.gridOptions = {
        data: 'csvClients',
        enableSorting: true,
        columnDefs: [
            {field: "first_name", displayName: 'First Name', enableCellEdit: false},
            {field: "last_name", displayName: 'Last Name', enableCellEdit: false},
            {field: "email", displayName: 'Email Address', enableCellEdit: false},
            {field: "phone", displayName: 'Phone Number', enableCellEdit: false},
            {field: "default_meal", displayName: 'Default Pack', enableCellEdit: false}
        ]
    };

    var formatData = function(rawData){
        rawData = _.uniq(rawData, 'Email');
        rawData = _.filter(rawData, function(entry){
            console.log('entry', entry);
            if(_.findWhere($scope.clients, {email: entry['Email']})){
                console.log('duplicate email!')
            }else{
                return entry;
            }
        });
        console.log('raw', rawData);
        var formattedData = [];

        //converts to friendlier data structure
        _.each(rawData, function(client){
            var getCategory = function(){
                var categoryArray = _.where($scope.categories, {category_name: client['Default Pack']});
                //console.log(categoryArray);
                if (categoryArray.length==0){
                    return $scope.categories[0];
                }
                return categoryArray[0];

            };
            var person = {
                email: client['Email'],
                first_name: client['First Name'],
                last_name: client['Last Name'],
                phone: client['Phone'],
                default_meal: getCategory().category_name,
                category_id: getCategory().category_id
            };
            //console.log(person);
            formattedData.push(person);
        });

        return formattedData;
    };

    $scope.post = function(){
        $http.post('/register/groupregister', $scope.csvClients).then(function(response){
            console.log(response);
            $scope.csvClients = undefined;
            $scope.clientsAdded = true;
        });
    }

    $scope.close = function () {
        $uibModalInstance.close('close');
    };

}]);

myApp.directive('customOnChange', function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeFunc = scope.$eval(attrs.customOnChange);
            element.bind('change', function(event){
                var files = event.target.files;
                onChangeFunc(files);
            });

            element.bind('click', function(){
                element.val('');
            });
        }
    };
});

