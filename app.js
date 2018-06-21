var app = angular.module('app', ['ui.router']);

        app.config(function($stateProvider, $urlRouterProvider)
    {
        $urlRouterProvider.otherwise("/home");
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'index.html',
                controller: 'myCtrl'
            })

            .state('login', {
                url: '/login',
                templateUrl: 'login.html',
                params: {userCreds: null},
                controller: 'myCtrl'
            })

            .state('prelogin', {
                url: '/prelogin',
                templateUrl: 'prelogin.html',
                params: {logoutSuccess: null},
                controller: 'myCtrl'
            })

            .state('profile', {
                url: '/profile',
                templateUrl: 'profile.html',
                params: {deleteVariables: null, userCreds: null},
                controller: 'myCtrl'
            })

            .state('search', {
                url: '/searchUsers',
                templateUrl: 'searchUsers.html',
                params: {userList: null, userCreds: null},
                controller: 'myCtrl'
            })

            .state('notifications', {
                url: '/notifications',
                templateUrl: 'notifications.html',
                params: {userCreds: null},
                controller: 'myCtrl'
            })

            .state('otherUsers', {
                url: '/otherUsers',
                templateUrl: 'otherUsers.html',
                params: {otherUserProfile: null, userCreds: null, viewedUser: null, commentVariables: null, isfollowing: null},
                controller: 'myCtrl'
            })
    })
        app.run(['$rootScope', '$state',
    function ($rootScope, $state) {
        $rootScope.$state = $state;
    }
]);
        app.filter('reverse', function() {
  return function(array) {
    return array.slice().reverse();
  };
});
        app.controller('myCtrl', function($scope, $state, $interval, $stateParams, $rootScope, reverseFilter) {
            if($state.current.name=="home" || $state.current.name=="prelogin"){
            sessionStorage.clear();
        }

            $scope.state = $state;
        if(angular.isDefined($stateParams)){
            if(angular.isDefined($stateParams.userCreds) && $stateParams.userCreds!=null){
            sessionStorage.setItem("userCredentials" , JSON.stringify($stateParams.userCreds));
            }
            if(angular.isDefined($stateParams.userList) && $stateParams.userList!=null){
            sessionStorage.setItem("userList" , JSON.stringify($stateParams.userList));
            }
            if(angular.isDefined($stateParams.deleteVariables) && $stateParams.deleteVariables!=null){
                if($stateParams.deleteVariables.deleteSuccess!=null){
            sessionStorage.setItem("deleteSuccess" , $stateParams.deleteVariables.deleteSuccess);
                }if($stateParams.deleteVariables.deleteStatus!=null){
            sessionStorage.setItem("deleteStatus" , $stateParams.deleteVariables.deleteStatus);
                }
            }
            if(angular.isDefined($stateParams.otherUserProfile) && $stateParams.otherUserProfile!=null){
            sessionStorage.setItem("otherUserProfile" , JSON.stringify($stateParams.otherUserProfile)); 
            }
            if(angular.isDefined($stateParams.viewedUser) && $stateParams.viewedUser!=null){
            sessionStorage.setItem("viewedUser" , $stateParams.viewedUser);
            }
            if(angular.isDefined($stateParams.commentVariables) && $stateParams.commentVariables!=null){
            sessionStorage.setItem("commentVariables" , JSON.stringify($stateParams.commentVariables)); 
            }
            if(angular.isDefined($stateParams.isfollowing) && $stateParams.isfollowing!=null){
            sessionStorage.setItem("isfollowing" , JSON.stringify($stateParams.isfollowing));
            }
            if(angular.isDefined($stateParams.logoutSuccess) && $stateParams.logoutSuccess!=null){
            $scope.logoutSuccess = $stateParams.logoutSuccess;
            }
    }
        /*if($scope.state.current.name=="search" || $scope.state.current.name=="profile"){
            document.getElementById('particles-js').removeAttribute("id");
            document.getElementsByTagName("canvas")[0].removeAttribute("class");
        }*/

        if(angular.isDefined(sessionStorage.getItem("userCredentials")) && sessionStorage.getItem("userCredentials")!=null){
        $scope.userCredentials = JSON.parse(sessionStorage.getItem("userCredentials"));
        }
        if(angular.isDefined(sessionStorage.getItem("userList")) && sessionStorage.getItem("userList")!=null){
        $scope.userList = JSON.parse(sessionStorage.getItem("userList"));
        $scope.followed = [];
        for(var i=0; i<$scope.userList.length; i++){
            $scope.followed[i] = false;
            for(var j=0; j<$scope.userCredentials.follows.length; j++){
                if($scope.userList[i]==$scope.userCredentials.follows[j]){
                    $scope.followed[i] = true;
                }
            }
        }
        }
        if(angular.isDefined(sessionStorage.getItem("deleteSuccess")) && sessionStorage.getItem("deleteSuccess")!=null){
        $scope.deleteSuccess = sessionStorage.getItem("deleteSuccess");
        }
        if(angular.isDefined(sessionStorage.getItem("deleteStatus")) && sessionStorage.getItem("deleteStatus")!=null){
        $scope.deleteStatus = sessionStorage.getItem("deleteStatus");
        }
        if(angular.isDefined(sessionStorage.getItem("otherUserProfile")) && sessionStorage.getItem("otherUserProfile")!=null){
        $scope.otherUserProfile = JSON.parse(sessionStorage.getItem("otherUserProfile")); 
        }
        if(angular.isDefined(sessionStorage.getItem("viewedUser")) && sessionStorage.getItem("viewedUser")!=null){
        $scope.viewedUser = sessionStorage.getItem("viewedUser");
        }
        if(angular.isDefined(sessionStorage.getItem("commentVariables")) && sessionStorage.getItem("commentVariables")!=null){
        $scope.commentVariables = JSON.parse(sessionStorage.getItem("commentVariables"));
        }
        if(angular.isDefined(sessionStorage.getItem("feedList")) && sessionStorage.getItem("feedList")!=null){
        $scope.blogListForFeed = JSON.parse(sessionStorage.getItem("feedList")); 
        }
        if(angular.isDefined(sessionStorage.getItem("isfollowing")) && sessionStorage.getItem("isfollowing")!=null){
        $scope.isfollowing = sessionStorage.getItem("isfollowing");
        }
        if(angular.isDefined(sessionStorage.getItem("notifObj")) && sessionStorage.getItem("notifObj")!=null){
        $scope.notifObj = JSON.parse(sessionStorage.getItem("notifObj"));
        }

        var NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
        var nebPay = new NebPay();

        var HttpRequest = require("nebulas").HttpRequest;
        var Neb = require("nebulas").Neb;
        var neb = new Neb();
        neb.setRequest(new HttpRequest("https://mainnet.nebulas.io"));

        if(typeof(webExtensionWallet) === "undefined"){
            $scope.noWebExtension = true;
        }

        var dappAddress = "n1rWovrRDQtAeVrd51hKeZhCjEnPE7of4WC";

        $scope.loginPage=false;
        $scope.passMatch=true;
        $scope.hiddenElement = false;
        $scope.signUpSuccess = false;
        $scope.loginSuccess = false;
        $scope.signUpTakingForever = false;
        $scope.signUpFailed = false;
        var executeTxn;
        var signUpFuncCalled = 0;
        var blogFuncCalled = 0;
        var deleteFuncCalled = 0;
        var commentFuncCalled = 0;
        var followFuncCalled = 0;
        var unfollowFuncCalled = 0;
        var settingsFuncCalled = 0;

        $scope.dateFormatter = function(dateString){
            return new Date(dateString).toLocaleDateString();
        }

        $scope.timeFormatter = function(dateString){
            return new Date(dateString).toLocaleTimeString();
        }

    $scope.$watch(
    function () { return $("#nameValidError")[0]; },
    function (newValue) {
      if (!angular.isDefined(newValue)) {
        $scope.nameValidationError=false;
      }
    }
    );
    $scope.$watch(
    function () { return $("#userNameValidError")[0]; },
    function (newValue) {
      if (!angular.isDefined(newValue)) {
        $scope.userNameValidationError=false;
      }
    }
    );
    $scope.$watch(
    function () { return $("#passValidError")[0]; },
    function (newValue) {
      if (!angular.isDefined(newValue)) {
        $scope.passValidationError=false;
      }
    }
  );

$scope.settingsPage = false;    

$scope.settings = function(){
    $scope.settingsPage = true;
    $scope.askForAuthentication = false;
    $scope.authenticateSettingsError = true;
    $scope.settingsAuthenticationError = false;
    $scope.nameLeftEmpty = false;
    $scope.userNameLeftEmpty = false;
    $scope.blockchainWalletLeftEmpty = false;
    $scope.settingsSuccess = false;
    $scope.settingsFailure = false;
    $scope.settingsTakingForever = false;
}

$scope.backToProfile = function(){
    $scope.settingsPage = false;
}

$scope.askForAuthentication = false;

$scope.editSettings = function(){
    $scope.askForAuthentication = true;
}

$scope.saveSettings = function(){
$scope.settingsFailure = false;
if(angular.isDefined($("#nameValidError")[0])){
    $scope.nameValidationError=true;
}
if(angular.isDefined($("#userNameValidError")[0])){
    $scope.userNameValidationError=true;
}
if(!angular.isDefined(document.getElementById('full_name').value) || !angular.isDefined(document.getElementById('user_name').value) || 
    !angular.isDefined(document.getElementById('blockchainWallet_id').value)
    || document.getElementById('full_name').value=='' || document.getElementById('user_name').value=='' || 
 document.getElementById('blockchainWallet_id').value==''){    
if(!angular.isDefined(document.getElementById('full_name').value) || document.getElementById('full_name').value==''){
    $scope.nameLeftEmpty = true;
    $("#full_name").removeClass("mb30");
}
if(!angular.isDefined(document.getElementById('user_name').value) || document.getElementById('user_name').value==''){
    $scope.userNameLeftEmpty = true;
    $("#user_name").removeClass("mb30");
}
if(!angular.isDefined(document.getElementById('blockchainWallet_id').value) || document.getElementById('blockchainWallet_id').value==''){
    $scope.blockchainWalletLeftEmpty = true;
    $("#blockchainWallet_id").removeClass("mb30");
}
}
else if(!$scope.nameValidationError && !$scope.userNameValidationError){
        $scope.settingsUserName = document.getElementById('user_name').value;
        $scope.nameSettings = document.getElementById('full_name').value;
        $scope.walletSettings = document.getElementById('blockchainWallet_id').value;
        if($scope.settingsUserName.trim()==$scope.userCredentials.userName && 
            $scope.nameSettings.trim()==$scope.userCredentials.fullName &&
            $scope.walletSettings.trim()==$scope.userCredentials.blockchainWallet){
            $scope.settingsFailure = true;
            $scope.settingsStatus = "All the values are same as before.";
        }else{
        if($scope.settingsUserName.trim()!=$scope.userCredentials.userName){
        $scope.saveSettingsLoader = true;    
        var callArgs = "[\"" + $scope.settingsUserName + "\"]";

        nebPay.simulateCall(dappAddress, "0", "authenticateSignUp", callArgs, { 
            listener: settingsAuthenticate
        });
        }else{
            var callArgs = "[\"" + $scope.userCredentials.userName + "\", \"" + $scope.settingsUserName + 
    "\", \"" + $scope.nameSettings + "\", \"" + $scope.walletSettings + "\"]";

        nebPay.call(dappAddress, "0", "editSettings", callArgs, { 
            listener: settingsSaved
        });
        }
    }
}
}

function settingsAuthenticate(response){
    if(response==null){
        $scope.settingsStatus = "Sorry we couldn't get a response from Blockchain.";
        $scope.saveSettingsLoader = false; 
    }
    else if(response.execute_err!=""){
        $scope.settingsFailure = true;
        $scope.settingsStatus = response.result;
        $scope.saveSettingsLoader = false;
    }
    else{
        var callArgs = "[\"" + $scope.userCredentials.userName + "\", \"" + $scope.settingsUserName + 
    "\", \"" + $scope.nameSettings + "\", \"" + $scope.walletSettings + "\"]";
        $scope.saveSettingsLoader = false;

        nebPay.call(dappAddress, "0", "editSettings", callArgs, { 
            listener: settingsSaved
        });
    }
    $scope.$apply();
}

function settingsSaved(response){
        if(response!=null){
            var txnHash = response.txhash;
            executeTxn = $interval(function() {
            settingsFuncCalled++;
            neb.api.getTransactionReceipt({hash: txnHash}).then(function(receipt) {

            if(receipt.status==0){
                settingsFuncCalled = 0;
                $scope.settingsFailure = true;
                $scope.settingsStatus = "Sorry, but your settings were not saved successfully.";
                $interval.cancel(executeTxn);
                $scope.$apply();
            }
            else if(receipt.status==1){
                settingsFuncCalled = 0;
                $scope.settingsSuccess = true;
                $scope.settingsStatus = "Your settings have been successfully saved.";
                $interval.cancel(executeTxn);
                $scope.userCredentials.userName = $scope.settingsUserName;
                $scope.userCredentials.fullName = $scope.nameSettings;
                $scope.userCredentials.blockchainWallet = $scope.walletSettings;
                sessionStorage.setItem("userCredentials", JSON.stringify($scope.userCredentials));
                $scope.settings();
                $scope.$apply();
            }
            else if(receipt.status==2 && settingsFuncCalled>40){
                settingsFuncCalled = 0;
                $scope.settingsTakingForever = true;
                $scope.settingsStatus = "It's taking longer than usual for settings to be saved to blockchain. Please try after sometime."
                $interval.cancel(executeTxn);
                $scope.$apply();
             }
});
        }, 3000);
            $scope.$apply();
        }
}

$scope.commentPopulated = [];

$scope.updateComment = function(comment, index){
    if(angular.isDefined(comment) && comment!=''){
        $scope.commentPopulated[index] = true;
        $scope.commentEntered = comment;
        $scope.commentVariables = [];
    }
    else{
        $scope.commentPopulated[index] = false;
    }
}    

    $scope.commentShown=[];

$scope.commentBlog = function(index){
    if(!angular.isDefined($scope.commentShown[index])){
        $scope.commentShown[index]=false;
    }
        $scope.commentShown[index]=!$scope.commentShown[index];
        if(!$scope.commentShown[index]){
            $scope.commentPopulated[index]=false;
            $scope.commentVariables = [];
        }
}  

$scope.commentAdded = false;  

$scope.postComment = function(index, author, date){
    var matchNotFound = true;
    if(angular.isDefined(author)){
        $scope.viewedUser = author;
        if(angular.isDefined(date)){
            for(var i in $scope.blogListForFeed){
                    if($scope.blogListForFeed[i].authorUserName==author && $scope.blogListForFeed[i].date==date){
                        index = $scope.blogListForFeed[i].blogIndex;
                        matchNotFound = false;
                        break;
                    }
            }
            if(matchNotFound){
                index = null;
            }
        }
    }
        if(angular.isDefined($scope.viewedUser)){
        var callArgs = "[\"" + $scope.viewedUser + "\", \"" + $scope.userCredentials.userName + "\", \"" + index + "\", \"" + $scope.commentEntered + "\"]";
        }
        else{
        var callArgs = "[\"" + $scope.userCredentials.userName + "\", \"" + $scope.userCredentials.userName + "\", \"" + index + "\", \"" + $scope.commentEntered + "\"]";    
        }
        nebPay.call(dappAddress, "0", "commentOnBlog", callArgs, { 
            listener: addComment
        });
}

function addComment(response){
        if(response!=null){
            var txnHash = response.txhash;
            executeTxn = $interval(function() {
            commentFuncCalled++;
            neb.api.getTransactionReceipt({hash: txnHash}).then(function(receipt) {

            if(receipt.status==0){
                commentFuncCalled = 0;
                $scope.commentFailure = true;
                $scope.commentStatus = "Sorry, but your comment was not posted successfully."
                $interval.cancel(executeTxn);
                $scope.$apply();
            }
            else if(receipt.status==1){
                commentFuncCalled = 0;
                $scope.commentSuccess = true;
                $scope.commentStatus = "Your comment has been successfully submitted."
                $scope.commentVariables = [];
                $scope.commentVariables.commentSuccess = $scope.commentSuccess;
                $scope.commentVariables.commentStatus = $scope.commentStatus;
                $interval.cancel(executeTxn);
                if($scope.state.current.name=="profile"){
                    $scope.profilePage();
                }
                else if($scope.state.current.name=="otherUsers"){
                    $scope.visitUserProfile($scope.viewedUser, $scope.isfollowing);
                }else if($scope.state.current.name=="login"){
                    $scope.commentAdded = true;
                    $scope.updateFeed($scope.userCredentials.userName, $scope.userCredentials.follows);
                }
                $scope.erase();
                $scope.$apply();
            }
            else if(receipt.status==2 && commentFuncCalled>40){
                commentFuncCalled = 0;
                $scope.commentTakingForever = true;
                $scope.commentStatus = "It's taking longer than usual for comment to be submitted to blockchain. Please try after sometime."
                $interval.cancel(executeTxn);
                $scope.$apply();
             }
});
        }, 3000);
            $scope.$apply();
        }
}   

$scope.erase = function(){
    if(angular.isDefined($("#blog_input")[0])){
    $("#blog_input")[0].value="";
    }
    if(angular.isDefined($("#blog_comment")[0])){
    $("#blog_comment")[0].value="";
    }
}    

$scope.updateLoginFlag = function(){
    $scope.loginPage=false;
    document.getElementById('blcDiary').scrollIntoView();
    $scope.signUpSuccess=false;
    $scope.logoutSuccess=false;
    $state.go('home');
    $scope.loginPage = false;
    updateFlagsOnBack();
}

var updateFlagsOnBack = function(){
    $scope.userNameLoginLeftEmpty = false;
    $scope.passwordLoginLeftEmpty = false;
    $scope.loginError = false;
    $scope.signUpError = false;
    $scope.loginPage = false;
    $scope.logoutSuccess = false;
}

$scope.signIn = function(){
    $scope.loginPage=true;
    document.getElementById('blcDiary').scrollIntoView();
    $scope.userNameLeftEmpty=false;
    $scope.nameLeftEmpty=false;
    $scope.authenticatingPinLeftEmpty=false;
    $scope.passwordLeftEmpty=false;
    $scope.retypePasswordLeftEmpty=false;
    $state.go('prelogin');
    $scope.signUpSuccess = false;
}
$scope.comparePasswords = function(pass1, pass2){
    if(angular.isDefined(pass2) && pass2!=''){
        $scope.retypePasswordLeftEmpty = false;
        $("#password2").addClass("mb30");
        if(pass1==pass2){
        $scope.passMatch=true;
        $scope.notMatch=false;
        $("#password2").addClass("mb30");
    }
    else{
        $scope.passMatch=false;
        $("#password2").removeClass("mb30");
    }
    }
}
$scope.updateName = function(name){
    if((angular.isDefined(name) && name!='') || (angular.isDefined(document.getElementById('full_name').value) && 
       document.getElementById('full_name').value!='')){
        $scope.nameLeftEmpty = false;
        $("#full_name").addClass("mb30");
    }
    if(!angular.isDefined($("#nameValidError")[0])){
        $scope.nameValidationError=false;
    }
}

$scope.updateUserName = function(userName){
    if((angular.isDefined(userName) && userName!='') || (angular.isDefined(document.getElementById('user_name').value) && 
      document.getElementById('user_name').value!='')){
        $scope.userNameLeftEmpty = false;
        $("#user_name").addClass("mb30");
    }
    if(!angular.isDefined($("#userNameValidError")[0])){
        $scope.userNameValidationError=false;
    }
}

$scope.updateAuthenticatingPin = function(authenticatingPin){
    if(angular.isDefined(authenticatingPin) && authenticatingPin!=''){
        $scope.authenticatingPinLeftEmpty = false;
        $("#authenticatingPin_id").addClass("mb30");
    }
}

$scope.updateBlockchainWallet = function(walletAddress){
    if((angular.isDefined(walletAddress) && walletAddress != '') || (angular.isDefined(document.getElementById('blockchainWallet_id').value) && 
           document.getElementById('blockchainWallet_id').value!='')){
        $scope.blockchainWalletLeftEmpty = false;
        $("#blockchainWallet_id").addClass("mb30");
    }
}

$scope.updatePassword1 = function(Password1){
    if(angular.isDefined(Password1) && Password1!=''){
        $scope.passwordLeftEmpty = false;
        $("#password1").addClass("mb30");
    }
    if(!angular.isDefined($("#passValidError")[0])){
        $scope.passValidationError=false;
    }
}

$scope.updateUserNameLogin=function(userName){
    if(angular.isDefined(userName) && userName!=''){
        $scope.userNameLoginLeftEmpty = false;
        $("#user_name_login").addClass("mb30");
    }
}

$scope.updatePasswordLogin=function(password){
    if(angular.isDefined(password) && password!=''){
        $scope.passwordLoginLeftEmpty = false;
        $("#password_login").addClass("mb30");
    }
}

$scope.updateEnteredPassword=function(enteredPassword){
    if(angular.isDefined(enteredPassword) && enteredPassword!=''){
        $scope.authenticatePasswordLeftEmpty = false;
    }
}

$scope.updateEnteredPin=function(enteredPin){
    if(angular.isDefined(enteredPin) && enteredPin!=''){
        $scope.authenticatePinLeftEmpty = false;
    }
}

$scope.updateBlog = function(blogText){
    if(angular.isDefined(blogText) && blogText!=''){
        $scope.blogSuccess = false;
        $scope.blogFailure = false;
        $scope.blogTakingForever = false;
        $scope.deleteSuccess = false;
        $scope.deleteFailure = false;
        $scope.deleteTakingForever = false;
    }
}

$scope.notMatch=false;
$scope.nameValidationError=false;
$scope.passValidationError=false;
$scope.userNameValidationError=false;

$scope.signUp = function(name, userName, authenticatingPin, password, retypePassword){
if(angular.isDefined($("#nameValidError")[0])){
    $scope.nameValidationError=true;
}
if(angular.isDefined($("#passValidError")[0])){
    $scope.passValidationError=true;
}
if(angular.isDefined($("#userNameValidError")[0])){
    $scope.userNameValidationError=true;
}    
if(!$scope.passMatch){
    $scope.notMatch=true;
}
if(!angular.isDefined(name) || !angular.isDefined(userName) || !angular.isDefined(password) || !angular.isDefined(retypePassword) || !angular.isDefined(authenticatingPin)
    || name=='' || userName=='' || password=='' || retypePassword=='' || authenticatingPin==''){    
if(!angular.isDefined(name) || name==''){
    $scope.nameLeftEmpty = true;
    $("#full_name").removeClass("mb30");

}
if(!angular.isDefined(userName) || userName==''){
    $scope.userNameLeftEmpty = true;
    $("#user_name").removeClass("mb30");
}
if(!angular.isDefined(authenticatingPin) || authenticatingPin==''){
    $scope.authenticatingPinLeftEmpty = true;
    $("#authenticatingPin_id").removeClass("mb30");
}
if(!angular.isDefined(password) || password==''){
    $scope.passwordLeftEmpty = true;
    $("#password1").removeClass("mb30");
}
if(!angular.isDefined(retypePassword) || retypePassword==''){
    $scope.retypePasswordLeftEmpty = true;
    $("#password2").removeClass("mb30");
}
}
else if(!$scope.nameValidationError && !$scope.passValidationError && !$scope.userNameValidationError && $scope.passMatch){
        $scope.usernameOfUser = userName;
        $scope.nameOfUser = name;
        $scope.authenticatingPinOfUser = authenticatingPin;
        $scope.passwordOfUser = password;
        var callArgs = "[\"" + userName + "\"]";
        $scope.signupLoader = true;

        nebPay.simulateCall(dappAddress, "0", "authenticateSignUp", callArgs, { 
            listener: authenticate
        });
}
}

function authenticate(response){
    if(response==null){
        $scope.signUpError = "Sorry we couldn't get a response from Blockchain.";
    }
    else if(response.execute_err!=""){
        $scope.signupLoader = false;
        $scope.signUpError = response.result;
        delete $scope.nameOfUser;
        delete $scope.usernameOfUser;
        delete $scope.authenticatingPinOfUser;
        delete $scope.passwordOfUser;
        $scope.$apply();
    }
    else{
        var callArgs = "[\"" + $scope.nameOfUser + "\", \"" + $scope.usernameOfUser + "\", \"" + $scope.authenticatingPinOfUser + "\", \"" + $scope.passwordOfUser + 
        "\"]";

        delete $scope.nameOfUser;
        delete $scope.usernameOfUser;
        delete $scope.authenticatingPinOfUser;
        delete $scope.passwordOfUser;

        $scope.signupLoader = false;
        $scope.signUpError = false;

        nebPay.call(dappAddress, "0", "signUp", callArgs, { 
            listener: blockchainSignUp
        });
    }
    $scope.$apply();
}

function blockchainSignUp(response) {
        if(response!=null){
            var txnHash = response.txhash;
            executeTxn = $interval(function() {
            signUpFuncCalled++;
            neb.api.getTransactionReceipt({hash: txnHash}).then(function(receipt) {

            if(receipt.status==0){
                signUpFuncCalled = 0;
                $scope.signUpFailed = true;
                $scope.signUpStatus = "Sorry, but we were unable to create your account."
                $interval.cancel(executeTxn);
                $scope.$apply();
            }
            else if(receipt.status==1){
                signUpFuncCalled = 0;
                $scope.signUpStatus = "Your account has been successfully created."
                $scope.signUpSuccess = true;
                $scope.signUpError = false;
                $scope.signUpFailed = false;
                $scope.signUpTakingForever = false;
                $interval.cancel(executeTxn);
                $scope.$apply();
                $state.go('prelogin');
            }
            else if(receipt.status==2 && signUpFuncCalled>40){
                signUpFuncCalled = 0;
                $scope.signUpTakingForever = true;
                $scope.signUpStatus = "It's taking longer than usual for sign up to complete. Please try again after some time."
                $interval.cancel(executeTxn);
                $scope.$apply();
             }
});
        }, 3000);
            $scope.$apply();
        }
    }

$scope.authenticateCredentials = function(password, pin){
if(!angular.isDefined(password) || !angular.isDefined(pin) || password=='' || pin==''){
if(!angular.isDefined(password) || password==''){
    $scope.authenticatePasswordLeftEmpty = true;
}
if(!angular.isDefined(pin) || pin==''){
    $scope.authenticatePinLeftEmpty = true;
}
}
else{
        $scope.authLoader = true;
        var callArgs = "[\"" + $scope.userCredentials.userName + "\", \"" + password + "\", \"" + pin + "\"]"; 
        nebPay.simulateCall(dappAddress, "0", "authenticateSettingsCredentials", callArgs, {    
            listener: authSettings      
        });
}
}   

$scope.authenticateSettingsError = true;

function authSettings(response){
    if(response==null){
        $scope.settingsAuthenticationError = "Sorry, we couldn't get a response from Blockchain.";
    }
    else if(response.execute_err!=""){
        $scope.settingsAuthenticationError = response.result;
    }else{
        $scope.authenticateSettingsError = false;
    }
    $scope.authLoader = false;
    $scope.$apply();
} 

$scope.logIn = function(userName, password){
if(!angular.isDefined(userName) || !angular.isDefined(password) || userName=='' || password==''){
if(!angular.isDefined(userName) || userName==''){
    $scope.userNameLoginLeftEmpty = true;
    $("#user_name_login").removeClass("mb30");
}
if(!angular.isDefined(password) || password==''){
    $scope.passwordLoginLeftEmpty = true;
    $("#password_login").removeClass("mb30");
}
}
else{
        $scope.loaderRunning = true;
        var callArgs = "[\"" + userName + "\", \"" + password + "\"]"; 
        nebPay.simulateCall(dappAddress, "0", "logIn", callArgs, {    
            listener: blockchainSignIn      
        });
}
}

//response from RPC call when trying to log in,
    function blockchainSignIn(response) {
        var result = response.result;

        if (result === 'null'){
            $scope.loaderRunning = false;
            $scope.loginError = "Sorry, we couldn't get a response from Blockchain. Please try again after some time.";
        } else{
            try{
                result = JSON.parse(result);
            }catch (err){
            }

            if (angular.isDefined(result) && result.userName){      //"return value"
                $scope.loginSuccess = true;
                $scope.userCredentials=result;
                $scope.loginError = false;
                $scope.signUpSuccess = false;
                $scope.$parent.$parent.signUpSuccess = false;
                $scope.updateFeed($scope.userCredentials.userName , $scope.userCredentials.follows);
                
            } else {        //"error message"
                $scope.loaderRunning = false;
                $scope.loginError = result;
            }

        }
        $scope.$apply();

    }

    if($scope.state.current.name=="login"){
            promise = $interval(function() {
            if($scope.state.current.name!='login'){
                if(angular.isDefined(promise)){
            $interval.cancel(promise);
        }
            }else{
            $scope.updateFeed($scope.userCredentials.userName, $scope.userCredentials.follows);
            }
        }, 60000);
    }

    $scope.refreshFeed = function(){
        if($scope.state.current.name=="login"){
            sessionStorage.setItem("loginTimestamp", new Date());
            $state.reload();
        }
    }

    $scope.notifications = function(){
        $scope.notificationLoader = true;
        $scope.checkForNotifications();
        $state.go('notifications', {userCreds: $scope.userCredentials});
    }

    $scope.logout = function(){
        var logoutInitiated = confirm('Are you sure you want to sign out?');
        if(logoutInitiated){
        $scope.$destroy();
        $rootScope = $rootScope.$new(true);
        $scope = $scope.$new(true);
        $scope.$parent = $scope.$parent.$new(true);
        sessionStorage.clear();
        $state.go('prelogin', {logoutSuccess: true});
    }
    }

    $scope.updateFeed = function(userName, follows){
        var callArgs = "[\"" + $scope.userCredentials.userName + "\", \"" + follows + "\"]"; 
        nebPay.simulateCall(dappAddress, "0", "updateFeed", callArgs, {    
            listener: feed      
        });

    }

    function feed(response){
        var result = response.result;

        if (result === 'null'){
            $scope.homeLoader = false;
            $scope.loaderRunning = false;
            $scope.loginError = response.execute_err;
            console.log($scope.loginError);
        } else{
            try{
                var blogListForFeed = JSON.parse(result);
                blogListForFeed.sort(function(a,b){
                  return new Date(b.date) - new Date(a.date);
                });
                $scope.updateFound = false;
                if($scope.state.current.name!="login" || ($scope.commentAdded && $scope.state.current.name=="login")){
                $state.go('login', {userCreds: $scope.userCredentials});
                }
                if((sessionStorage.length==0) || (sessionStorage.getItem("loginTimestamp")==null)){
                sessionStorage.setItem("loginTimestamp", new Date());
                }
                if($scope.state.current.name=="login"){
                for(var i in blogListForFeed){
                    if((new Date(blogListForFeed[i].date)).getTime() > new Date(sessionStorage.getItem("loginTimestamp")).getTime()){
                        $scope.updateFound = true;
                        break;
                    }
                }
            }
            sessionStorage.setItem("feedList", JSON.stringify(blogListForFeed));
            $scope.homeLoader = false;
            if((angular.isDefined(blogListForFeed) && blogListForFeed.length>0) && (!$scope.updateFound || $scope.commentAdded)){
            $scope.blogListForFeed = JSON.parse(sessionStorage.getItem("feedList"));
            $scope.updateFound = false;
            }
            $scope.checkForNotifications();
            }catch (err){
                $scope.loaderRunning = false;
                $scope.homeLoader = false;
                console.log(err);
            }
        }
        $scope.$apply();
    }

            /*Check for notifications*/
            /*notifCheck = $interval(function() {
            if(angular.isDefined($scope.state) && $scope.state.current.name=='prelogin' || $scope.state.current.name=='home'){
            if(angular.isDefined(notifCheck)){
            $interval.cancel(notifCheck);
            }
            }else{
            $scope.checkForNotifications();
            }
        }, 60000);*/

    $scope.checkForNotifications = function(){
        if(angular.isDefined($scope.userCredentials)){
        var callArgs = "[\"" + $scope.userCredentials.userName + "\"]"; 
        nebPay.simulateCall(dappAddress, "0", "getNotifications", callArgs, {    
            listener: updateNotifications      
        });
    }
    }

    function updateNotifications(response){
        var result = response.result;

        if (result === 'null'){
            $scope.notificationLoader = false;
            $scope.loaderRunning = false;
            console.log("Sorry, we couldn't get a response from Blockchain. Please try again after some time.");
        } else{
            try{
                $scope.notifObj = JSON.parse(result);
                $scope.notifObj.sort(function(a,b){
                  return new Date(b.date) - new Date(a.date);
                });
                sessionStorage.setItem("notifObj", JSON.stringify($scope.notifObj));
                $scope.notificationLoader = false;
            }catch (err){
                $scope.notificationLoader = false;
                $scope.loaderRunning = false;
                console.log(err);
            }
        }
        $scope.$apply();
    } 

    $scope.blog=function(blogInput){
        $scope.blogInput = blogInput;
        if(angular.isDefined(blogInput) && blogInput!=''){
        var callArgs = "[\"" + $scope.userCredentials.userName + "\", \"" + blogInput + "\"]";

        nebPay.call(dappAddress, "0", "blog", callArgs, { 
            listener: blockchainBlog
        });
        }
    }

    function blockchainBlog(response){
        if(response!=null){
            var txnHash = response.txhash;
            executeTxn = $interval(function() {
            blogFuncCalled++;
            neb.api.getTransactionReceipt({hash: txnHash}).then(function(receipt) {

            if(receipt.status==0){
                blogFuncCalled = 0;
                $scope.blogFailure = true;
                $scope.blogStatus = "Sorry, but your blog was not saved successfully."
                $interval.cancel(executeTxn);
                $scope.$apply();
            }
            else if(receipt.status==1){
                blogFuncCalled = 0;
                $scope.blogSuccess = true;
                $scope.blogStatus = "Your blog has been successfully submitted."
                $scope.deleteSuccess = false;
                $interval.cancel(executeTxn);
                $scope.erase();
                if($scope.state.current.name=="profile"){
                    $scope.profilePage();
                }
                $scope.$apply();
            }
            else if(receipt.status==2 && blogFuncCalled>40){
                blogFuncCalled = 0;
                $scope.blogTakingForever = true;
                $scope.blogStatus = "It's taking longer than usual for blog to be added to blockchain. Please try after sometime."
                $interval.cancel(executeTxn);
                $scope.$apply();
             }
});
        }, 3000);
            $scope.$apply();
        }
    }

    $scope.deleteBlog = function($index){
        var deleteInitiated = confirm('Are you sure you want to delete this blog?');
        if(deleteInitiated){
        var callArgs = "[\"" + $scope.userCredentials.userName + "\", \"" + $index + "\"]";

        nebPay.call(dappAddress, "0", "deleteBlog", callArgs, { 
            listener: deletion
        });
        }
    }

    function deletion(response){
        if(response!=null){
            var txnHash = response.txhash;
            executeTxn = $interval(function() {
            deleteFuncCalled++;
            neb.api.getTransactionReceipt({hash: txnHash}).then(function(receipt) {

            if(receipt.status==0){
                deleteFuncCalled = 0;
                $scope.deleteFailure = true;
                $scope.deleteStatus = "Sorry, but your blog was not deleted successfully."
                $interval.cancel(executeTxn);
                $scope.$apply();
            }
            else if(receipt.status==1){
                deleteFuncCalled = 0;
                $scope.deleteSuccess = true;
                $scope.deleteStatus = "Your selected blog has been deleted successfully."
                $scope.blogSuccess = false;
                $interval.cancel(executeTxn);
                $scope.profilePage();
                $scope.$apply();
            }
            else if(receipt.status==2 && deleteFuncCalled>40){
                deleteFuncCalled = 0;
                $scope.deleteTakingForever = true;
                $scope.deleteStatus = "It's taking longer than usual for blog to be deleted from blockchain. Please try after sometime."
                $interval.cancel(executeTxn);
                $scope.$apply();
             }
});
        }, 3000);
            $scope.$apply();
        }
    }

$scope.profilePage =function(){
    $scope.profileLoader = true;
    $scope.commentSuccess = false;
    if(!$scope.settingsSuccess){
        $scope.settingsPage = false;
    }
    var callArgs = "[\"" + $scope.userCredentials.userName + "\"]";
    nebPay.simulateCall(dappAddress, "0", "getUserProfile", callArgs, { 
        listener: userProfile
    });
}    

function userProfile(response){
    var result = response.result;

        if (result === 'null'){
            $scope.retrievingProfileError = response.execute_err;
            $scope.profileLoader = false;
        } else{
            try{
                result = JSON.parse(result);
            }catch (err){
            }

            if (angular.isDefined(result) && result.userName){      //"return value"
                $scope.loginSuccess = true;
                $scope.loginError = false;
                $scope.signUpSuccess = false;
                $scope.signUpStatus = false;
                $scope.userCredentials = result;
                $scope.$apply();
                var deleteParams = [];
                deleteParams.deleteSuccess = $scope.deleteSuccess;
                deleteParams.deleteStatus = $scope.deleteStatus;
                if(($scope.state.current.name!="profile") || ($scope.state.current.name=="profile" && ($scope.blogSuccess || $scope.deleteSuccess))){
                $scope.blogSuccess = false;
                $scope.deleteSuccess = false;
                $state.go('profile', {deleteVariables:deleteParams, userCreds: $scope.userCredentials});
                }
                $scope.profileLoader = false;
                $scope.userCredentials = result;
            sessionStorage.setItem("userCredentials", JSON.stringify($scope.userCredentials));
            if($scope.settingsSuccess){
                    $scope.settings();
                }
                
            } else {        //"error message"
                $scope.retrievingProfileError = result;
                console.log($scope.retrievingProfileError);
                $scope.profileLoader = false;
            }

        }
        $scope.$apply();
}

$scope.visitUserProfile =function(user, isfollowing, index){
    if(angular.isDefined(index) && index!=null){
        $scope.viewLoader = [];
        $scope.viewedUserIndex = index;
        $scope.viewLoader[index] = true;
    }
        if(angular.isDefined(isfollowing)){
        $scope.isfollowing = isfollowing;
        }else{
        if($scope.userCredentials.follows.length<=0){
            $scope.isfollowing = false;
        }else{
        for(var i=0; i<$scope.userCredentials.follows.length; i++){
            if($scope.userCredentials.follows[i]!=user){
                $scope.isfollowing = false;
            }
            else{
                $scope.isfollowing = true;
                break;
            }
        }    
        }
        }
        var callArgs = "[\"" + user + "\"]";
        $scope.viewedUser = user;   
        nebPay.simulateCall(dappAddress, "0", "getUserProfile", callArgs, { 
            listener: visitProfile
        });
}    

function visitProfile(response){
    var result = response.result;

        if (result === 'null'){
            $scope.retrievingProfileError = response.execute_err;
            if(angular.isDefined($scope.viewLoader) && $scope.viewLoader!=null && angular.isDefined($scope.viewedUserIndex) && $scope.viewedUserIndex!=null){
            $scope.viewLoader[$scope.viewedUserIndex] = false;
            }
        } else{
            try{
                result = JSON.parse(result);
            }catch (err){
            }

            if (angular.isDefined(result) && result.userName){
            if($scope.state.current.name!="otherUsers"){      //"return value"
                $state.go('otherUsers', {otherUserProfile: result, userCreds: $scope.userCredentials, viewedUser: $scope.viewedUser,
                    commentVariables:$scope.commentVariables, isfollowing:$scope.isfollowing});
        }
        if(angular.isDefined($scope.viewLoader) && $scope.viewLoader!=null && angular.isDefined($scope.viewedUserIndex) && $scope.viewedUserIndex!=null){
            $scope.viewLoader[$scope.viewedUserIndex] = false;
            }
        $scope.otherUserProfile = result;
        sessionStorage.setItem("otherUserProfile", JSON.stringify($scope.otherUserProfile));
                
            } else {        //"error message"
                $scope.retrievingProfileError = result;
                if(angular.isDefined($scope.viewLoader) && $scope.viewLoader!=null && angular.isDefined($scope.viewedUserIndex) && $scope.viewedUserIndex!=null){
            $scope.viewLoader[$scope.viewedUserIndex] = false;
            }
            }

        }
        $scope.$apply();
}

$scope.followUser = function(toFollow, index){
        $scope.unfollowSuccess = false;
        var callArgs = "[\"" + toFollow + "\", \"" + $scope.userCredentials.userName + "\"]";
        if(angular.isDefined(index)){
        $scope.userIndex = index;
        }
        $scope.toFollow = toFollow;
        nebPay.call(dappAddress, "0", "followUser", callArgs, { 
            listener: followProcess
        });
}

function followProcess(response){
        if(response!=null){
            var txnHash = response.txhash;
            executeTxn = $interval(function() {
            followFuncCalled++;
            neb.api.getTransactionReceipt({hash: txnHash}).then(function(receipt) {

            if(receipt.status==0){
                followFuncCalled = 0;
                $scope.followFailure = true;
                $scope.followStatus = "Sorry, but your request to follow this user failed."
                $interval.cancel(executeTxn);
                $scope.$apply();
            }
            else if(receipt.status==1){
                followFuncCalled = 0;
                $scope.followSuccess = true;
                $scope.followStatus = "You have successfully followed this user."
                $interval.cancel(executeTxn);
                if(angular.isDefined($scope.userIndex)){
                $scope.followed[$scope.userIndex] = true;
                }
                $scope.isfollowing = true;
                sessionStorage.setItem("isfollowing", $scope.isfollowing);
                if(angular.isDefined($scope.otherUserProfile)){
                $scope.otherUserProfile.numberOfFollowers++;
                sessionStorage.setItem("otherUserProfile", JSON.stringify($scope.otherUserProfile));
                }
                $scope.userCredentials.follows.push($scope.toFollow);
                sessionStorage.setItem("userCredentials", JSON.stringify($scope.userCredentials));
                $scope.$apply();
            }
            else if(receipt.status==2 && followFuncCalled>40){
                followFuncCalled = 0;
                $scope.followTakingForever = true;
                $scope.followStatus = "It's taking longer than usual for user to be followed. Please try after sometime."
                $interval.cancel(executeTxn);
                $scope.$apply();
             }
});
        }, 3000);
            $scope.$apply();
        }
}

$scope.unfollowUser = function(toUnfollow, index){
    $scope.followSuccess = false;
        $scope.toUnfollow = toUnfollow;
        var callArgs = "[\"" + toUnfollow + "\", \"" + $scope.userCredentials.userName + "\"]";
        if(angular.isDefined(index)){
        $scope.userIndexToBeUnfollowed = index;
        }
        nebPay.call(dappAddress, "0", "unfollowUser", callArgs, { 
            listener: unfollowProcess
        });
}

function unfollowProcess(response){
        if(response!=null){
            var txnHash = response.txhash;
            executeTxn = $interval(function() {
            unfollowFuncCalled++;
            neb.api.getTransactionReceipt({hash: txnHash}).then(function(receipt) {

            if(receipt.status==0){
                unfollowFuncCalled = 0;
                $scope.unfollowFailure = true;
                $scope.unfollowStatus = "Sorry, but your request to unfollow this user failed."
                $interval.cancel(executeTxn);
                $scope.$apply();
            }
            else if(receipt.status==1){
                unfollowFuncCalled = 0;
                $scope.unfollowSuccess = true;
                $scope.unfollowStatus = "You have successfully unfollowed this user."
                $interval.cancel(executeTxn);
                if(angular.isDefined($scope.userIndexToBeUnfollowed)){
                $scope.followed[$scope.userIndexToBeUnfollowed] = false;
                }
                $scope.isfollowing = false;
                sessionStorage.setItem("isfollowing", $scope.isfollowing);
                if(angular.isDefined($scope.otherUserProfile)){
                $scope.otherUserProfile.numberOfFollowers--;
                sessionStorage.setItem("otherUserProfile", JSON.stringify($scope.otherUserProfile));
                }
                $scope.userCredentials.follows.splice($scope.userCredentials.follows.indexOf($scope.toUnfollow),1);
                sessionStorage.setItem("userCredentials", JSON.stringify($scope.userCredentials));
                $scope.$apply();
            }
            else if(receipt.status==2 && unfollowFuncCalled>40){
                unfollowFuncCalled = 0;
                $scope.unfollowTakingForever = true;
                $scope.unfollowStatus = "It's taking longer than usual for user to be unfollowed. Please try after sometime."
                $interval.cancel(executeTxn);
                $scope.$apply();
             }
});
        }, 3000);
            $scope.$apply();
        }
}

$scope.homePage = function(){
    $scope.homeLoader = true;
    $scope.updateFeed($scope.userCredentials.userName, $scope.userCredentials.follows);
}

    $scope.searchUsers =function(searchTxt){
        $scope.searchLoader = true;
        if(!angular.isDefined(searchTxt) || searchTxt==''){
        var callArgs = "[\"" + $scope.userCredentials.userName + "\"]";
        }
        else{
        var callArgs = "[\"" + $scope.userCredentials.userName + "\", \"" + searchTxt + "\"]";   
    }
        nebPay.simulateCall(dappAddress, "0", "searchUserList", callArgs, { 
            listener: retrieveUserData
        });
}

function retrieveUserData(response){
    if(response==null){
        $scope.searchUsersError = "Sorry, we couldn't get a response from Blockchain. Please try again after some time."
        $scope.searchLoader = false;
    }
    else if(response.execute_err!=""){
        $scope.searchUsersError = response.result;
        $scope.searchLoader = false;
    }
    var result = response.result;

        if (result === 'null'){
            $scope.searchUsersError = "Sorry, we couldn't get a response from Blockchain. Please try again after some time.";
            $scope.searchLoader = false;
        } else{
            try{
                result = JSON.parse(result);
            }catch (err){
            }

            if (result){      //"return value"
                $state.go('search', {userList: result, userCreds: $scope.userCredentials});
                $scope.searchLoader = false;
                
            }

        }
        $scope.$apply();
}

$scope.displayInfoMessage = function(message){
    document.getElementById("overlay").style.display = "block";
    $("#text").text(message);
}

$scope.hideMessage =function() {
    document.getElementById("overlay").style.display = "none";
}

});