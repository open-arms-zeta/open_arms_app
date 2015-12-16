myApp.factory('DataService', ['$http', function($http){
    /*
     categories - done ish
     menu by week - also done ish
     active week logic

    * */
    //PRIVATE
    //array
    var categories = undefined;
    //date
    var activeWeek = undefined;
    //array of objects
    var menu = undefined;
    //array
    var clientOrders = undefined;


    var retrieveCategories = function(){
        //some http call to get categories, and set it to categories variable
        return $http.get('/getcategories').then(function(response){
            categories = response.data;
        })
    };

    var retrieveMenuByWeek = function(startDate, endDate){
        //returns the http call to get a menu by date input, and sets menu variable to the returned result
        return $http.get('/getmenu', {params: {startDate: startDate, endDate: endDate}}).then(function(response){

            menu = response.data;
        })
    };

    var calculateActiveWeek = function(){
        var d = new Date();
        //console.log("hi", (7-d.getDay())%7+15);
        var daysToActiveWeek = (7-d.getDay())%7+15;
        d.setDate(d.getDate()+daysToActiveWeek);
        console.log(d);
        activeWeek = d;
        return d;
    };

    var retrieveClientOrders = function(startDate, endDate){
        console.log("hi");
        return $http.get('/getclients', {params: {startDate: startDate, endDate: endDate}}).then(function(response){
            console.log(response.data);
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
        }
    };

    return publicApi;
}]);