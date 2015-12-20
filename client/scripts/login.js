$(document).ready(function(){
    $( ".input" ).focusin(function() {
        $(this).find( "span" ).animate({"opacity":"0"}, 200);
        $(".feedback-failure").hide().animate({"opacity":"0", "bottom":"-80px"}, 400);
    });

    $( ".input" ).focusout(function() {
        $(this).find( "span" ).animate({"opacity":"1"}, 300);
    });

    $(".login").submit(function(){
        var values = {};
        //add form elements
        $.each($(this).serializeArray(),function(i,field){
            values[field.name] = field.value;
        });

        //ANIMATION


        console.log(values);

        login(values, this);
        return false;
    });

    var login = function(values, context){
        $.ajax({
            url: "/",
            type: "POST",
            data: values,
            success: function(data, textStatus, jqXHR){
                console.log(data);

                $(".feedback-success").show().animate({"opacity":"1", "bottom":"-80px"}, 400);
                $(".submit").css({"background":"#2ecc71", "border-color":"#2ecc71"});
                $("input").css({"border-color":"#2ecc71"});
                $(context).find(".submit i").removeAttr('class').addClass("fa fa-check").css({"color":"#fff"});
                setTimeout(function(){
                    window.location = data;
                },500)

            },
            error: function(data){
                console.log(data);
                console.log("failure");
                $(".feedback-failure").show().animate({"opacity":"1", "bottom":"-80px"}, 400);
            }
        });
        //$.ajax
        //url: '/login'
        //type: 'POST'
        //data: $('#Password').serialize()
        //dataType: 'json'
        //success: (data, textStatus, jqXHR) ->
        //if typeof data.redirect == 'string'
        //    window.location = data.redirect
    }
});

//var myApp = angular.module('myApp', ['ngAnimate', 'ngMessages', 'ngSanitize']);
//
//myApp.controller('LoginController', ["$scope", "$http", "$animate", function($scope, $http, $animate){
//    //jQuery( ".input" ).focusin(function() {
//    //    $(this).find( "span" ).animate({"opacity":"0"}, 200);
//    //});
//    //
//    //jQuery( ".input" ).focusout(function() {
//    //    $(this).find( "span" ).animate({"opacity":"1"}, 300);
//    //});
//    //
//    //jQuery(".login").submit(function(){
//    //
//    //    //ANIMATION
//    //    $(this).find(".submit i").removeAttr('class').addClass("fa fa-check").css({"color":"#fff"});
//    //    $(".submit").css({"background":"#2ecc71", "border-color":"#2ecc71"});
//    //    $(".feedback").show().animate({"opacity":"1", "bottom":"-80px"}, 400);
//    //    $("input").css({"border-color":"#2ecc71"});
//    //    return false;
//    //});
//    console.log('sup');
//
//    $scope.focus = function(){
//        console.log('focused');
//    };
//
//    $scope.unfocus = function(){
//        console.log('blurred');
//    };
//
//    $scope.login = function(){
//
//    };
//}]);