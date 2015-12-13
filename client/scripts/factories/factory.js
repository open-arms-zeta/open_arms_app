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
    //array
    var mealCount = undefined;


    var retrieveCategories = function(){
        //some http call to get categories, and set it to categories variable
    };

    var retrieveMenuByWeek = function(date){
        //returns the http call to get a menu by date input, and sets menu variable to the returned result
    };

    var calculateActiveWeek = function(){
        var d = new Date();
        //console.log("hi", (7-d.getDay())%7+15);
        var daysToActiveWeek = (7-d.getDay())%7+15;
        d.setDate(d.getDate()+daysToActiveWeek);
        console.log(d);
        activeWeek = d;
    };

    var getClientOrders = function(){

    };

    //PUBLIC
    var publicApi = {
        retrieveCategories: function(){
            return retrieveCategories();

        },
        getCategories: function(){
            return categories;
        },
        retrieveMenuByWeek: function(date){
            return retrieveMenuByWeek(date);
        },
        getMenu: function(){
            return menu;
        },
        calculateActiveWeek: function(){
            return calculateActiveWeek();
        },
        getActiveWeek: function(){
            return activeWeek;
        }
    };

    return publicApi;
}]);