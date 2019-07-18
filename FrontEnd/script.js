var app = angular.module("mainApplication", ["ngRoute", "ngMaterial","ngAnimate"]);

app.config([
  "$routeProvider",
  "$locationProvider",
  function($routeProvider, $locationProvider) {
    $routeProvider.when("/", {
      templateUrl: "./views/login.html",
      controller: "loginController"
    });
    $routeProvider.when("/home", {
      templateUrl: "./views/home.html",
      controller: "homeController"
    });
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }
]);

app.service("genrateURL", function() {
  var url = "http://localhost:3334/app_api/";
  return {
    login: function() {
      return url + "authenticate";
    }
  };
});

app.service("backEndService", function($http, genrateURL) {
  return {
    login: function(username, password, otp) {
      var data = {};
      data.username = username;
      data.password = password;
      data.otp = otp;
      console.log(data);

      return $http.post(genrateURL.login(), data);
    }
  };
});

app.service("showToast", function($mdToast, $log) {
  return {
    simple: function(text) {
      $mdToast
        .show(
          $mdToast
            .simple()
            .textContent(text)
            .position('bottom left')
            .hideDelay(3000)
        )
        .then(function() {
          $log.log("Toast dismissed.");
        })
        .catch(function() {
          $log.log(
            "Toast failed or was forced to close early by another toast."
          );
        });
    }
  };
});

app.controller("loginController", function(
  $scope,
  backEndService,
  $location,
  showToast,
  $mdToast,
  $mdDialog
) {
  $scope.user = {};
  $scope.showOTP = false;
  $scope.QrCode = "";
  $scope.onLogin = function() {
    backEndService
      .login($scope.user.userName, $scope.user.password, $scope.user.otp)
      .then(data => {
        console.log("received data");
        if (data.data.success === true) {
          $scope.showOTP = true;
          if (data.data.requiresQr) {
            $scope.QrCode = data.data.image;
          } else if (data.data.token) {
            console.log(data.data.token);
            $location.path("/home");
          }
        } else {
         
            $mdDialog.show(
                $mdDialog.alert()
                  .clickOutsideToClose(true)
                  .title('Error')
                  .textContent('Wrong UserName password or otp ')
                  .ok('Got it!')
                 
              )
        }
      })
      .catch(err => {
        console.log("error has occured");
        console.log(err);
      });
  };
});
app.controller("index-controller", function($scope) {});
app.controller("homeController", function($scope) {});
