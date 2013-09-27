
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {

}
function getParameterByName(name, url) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = name + "=([^&#]*)";

    console.log("Parameter name: " + name);
    console.log("Url: " + url);

    var regex = new RegExp(regexS);
    var results = regex.exec(url);

    console.log("Result: " + results);

    if (results == null) {
        return false;
    }
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}
var fbClientID = "yourappclinetidfromfacebook";
var IdentityProvider = function (config) {
    var that = this;
    var ref;
    this.getAccessToken = function (callback) {

        // Begin Authorization
        var authorize_url = config.endpoint
                            + "?response_type=" + config.response_type
                            + "&client_id=" + config.client_id
                            + "&redirect_uri=" + config.redirect_uri
                            + "&display=" + config.display
                            + "&access_type=" + config.access_type
                            + "&scope=" + config.scope

        //CALL IN APP BROWSER WITH THE LINK
        ref = window.open(authorize_url, '_blank', 'location=no');

        ref.addEventListener('loadstart', function (event) {
            that.locationChanged(event.url, callback);
        });

        ref.addEventListener('loadstop', function (event) {
            that.locationChanged(event.url, callback);
        });


    }

    this.locationChanged = function (loc, callback) {
        if (loc.indexOf("access_token=") != -1) {
            ref.close();
            var token = getParameterByName("access_token", loc);
            callback(token);
        }
    }
}


var facebook = new IdentityProvider({
    name: "My Test App",
    loginMethodName: "loginWithFacebook",
    endpoint: "https://www.facebook.com/dialog/oauth",
    response_type: "token",
    client_id: fbClientID,
    redirect_uri: "https://www.facebook.com/connect/login_success.html",
    access_type: "online",
    scope: "email,publish_actions",
    display: "touch"
});

function PostOnFb(e)
{   
    var msgToPost = $('#msgTxt').val();
    alert(msgToPost)
    facebook.getAccessToken(function (token) {              
        makefbPost(msgToPost, "http://debugmode.net", "DebugMode", token);
    });
}

function makefbPost(FBmessage, FBLink, FBLinkName, fbToken) {
    var postURL = "https://graph.facebook.com/me/feed";
    var data = {};
    data.message = FBmessage;
    data.name = FBLinkName;
    data.link = FBLink;

    data.access_token = fbToken;
    console.log("Token:" + fbToken);

    $.post(postURL, data)
       .done(function (results) {
           navigator.notification.alert("Status Posted", function () { }, "DebugMode", "Done");

       })
           .error(function (err) {
               navigator.notification.alert("Error encountered. Details:" + err.message, function () { }, "Error", "Done");
           });
}