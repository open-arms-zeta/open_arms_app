$(document).ready(function(){
    var existingUsers = undefined;

    $( ".input" ).focusin(function() {
        $(this).find( "span" ).animate({"opacity":"0"}, 200);
        $(".feedback-failure").hide().animate({"opacity":"0", "bottom":"-80px"}, 400);
        $(".feedback-failure-username").hide().animate({"opacity":"0", "bottom":"-80px"}, 400);
    });

    $( ".input" ).focusout(function() {
        $(this).find( "span" ).animate({"opacity":"1"}, 300);
    });

    $(".login").submit(function(event){
        event.preventDefault();
        var values = {};
        //add form elements
        $.each($(this).serializeArray(),function(i,field){
            values[field.name] = field.value;
        });

        //checks registration
        //$.when(pullEmails()).then(checkRegistration(values));
        pullEmails(values, this);
        return false;
    });

    var pullEmails = function(values){
        return $.ajax({
            url: "/register/all",
            type: "GET",
            success: function(data){
                //console.log(data);
                existingUsers = data;
                checkRegistration(values);
            }

        })
    };

    var checkRegistration = function(values, context){
        if(values.password != values.checkPassword){
            $(".feedback-failure").show().animate({"opacity":"1", "bottom":"-80px"}, 400);
            $('.password :input').val("");
            //$(this).empty();
            return false;
        }else if(accountExists(values.email)){
            $(".feedback-failure-username").show().animate({"opacity":"1", "bottom":"-80px"}, 400);
            $('.input :input').val("");
        }else{
            register(values, context);
        }

    };


    var accountExists = function(username){
        for(var i = 0; i<existingUsers.length; i++){
            if(existingUsers[i].email == username){
                console.log('checking', existingUsers[i].email);
                return true;
            }
        }
        return false;
    };

    var register = function(values, context){
        console.log(values);
        $.ajax({
            url: "/register/admin",
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

            }
        });
    };

});
