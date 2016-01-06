myApp.factory('DataService', ['$http', function($http){
    /*
     categories - done ish
     menu by week - also done ish
     active week logic

    * */
    //PRIVATE

    //object
    var user = undefined;
    //array
    var categories = undefined;
    //date
    var activeWeek = undefined;
    //array of objects
    var menu = undefined;
    //array
    var clientOrders = undefined;
    // clients
    var allEmails = undefined;


    var getAllEmails = function(){
        return $http.get('/register/all').then(function(response){
            allEmails = response.data;
            console.log('clients in db', $scope.clients);
        })
    };
    var retrieveCategories = function(){
        //some http call to get categories, and set it to categories variable
        return $http.get('/getcategories').then(function(response){
            categories = response.data;
        })
    };

    var retrieveMenuByWeek = function(startDate){
        //returns the http call to get a menu by date input, and sets menu variable to the returned result
        return $http.get('/getmenu', {params: {startDate: startDate}}).then(function(response){

            menu = response.data;
        })
    };

    var retrieveUser = function(){
        return $http.get('/user').then(function(response){
            user = response.data;
        })
    };

    var calculateActiveWeek = function(){
        //CALCULATES THE MONDAY OF THE ACTIVE WEEKS (3rd upcoming monday)
        var d = new Date();
        var daysToActiveWeek = (7-d.getDay())%7+15;
        d.setDate(d.getDate()+daysToActiveWeek);
        activeWeek = d;
        return d;
    };

    var retrieveClientOrders = function(startDate, endDate){
        //pulls in client orders for a given start and end date
        console.log(startDate);
        return $http.get('/getclients', {params: {startDate: startDate, endDate: endDate}}).then(function(response){
            clientOrders = response.data;
        })
    };

    //PUBLIC
    var publicApi = {
        //retrieve and get categories
        retrieveCategories: function(){
            return retrieveCategories();

        },
        getCategories: function(){
            return categories;
        },

        //retrieve menu by week
        retrieveMenuByWeek: function(startDate, endDate){
            return retrieveMenuByWeek(startDate, endDate);
        },
        getMenu: function(){
            return menu;
        },

        //recalculate and assign active week (monday of active week)
        calculateActiveWeek: function(){
            return calculateActiveWeek();
        },
        getActiveWeek: function(){
            return activeWeek;
        },

        //get client orders
        retrieveClientOrders: function(startDate, endDate){
            return retrieveClientOrders(startDate, endDate);
        },
        getClientOrders: function(){
            return clientOrders;
        },

        //get user in session
        retrieveUser: function(){
            return retrieveUser();
        },
        getUser: function(){
            return user;
        },
        getAllEmails: function(){
            return getAllEmails()
        },
        allEmails: function(){
            return allEmails;
        }
    };

    return publicApi;
}]);