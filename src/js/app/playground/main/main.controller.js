/**
 * Created by matthew.sanders on 2/23/15.
 */
angular.module('playGroundApp').controller('mainCtrl', function ($rootScope, $scope, $log, $location, service, model) {
  $scope.model = model;
  if(model.user.firstname){
    $rootScope.loggedIn = true;
    $rootScope.firstname = model.user.firstname;
    $rootScope.lastname = model.user.lastname;
    //$scope.firstname = model.user.firstname;
    //$scope.lastname = model.user.lastname;
  }else{
    $rootScope.loggedIn = false;
  }
  $scope.myInterval = 5000;
  var slides = $scope.slides = [];
  var img = [
    {image: "/assets/img/gcity.jpg", text: "Garden City, Utah"},
    {image:"/assets/img/muir.jpg", text: "Muir Woods San Francisco, California"},
    {image:"/assets/img/SanFrancisco.jpg", text: "San Francisco, California"},
    {image:"/assets/img/sanfrannight.jpg", text: "Garden City, Utah"},
    {image:"/assets/img/usu.jpg", text: "Utah State University Logan, Utah"},
    {image:"/assets/img/wcd.jpg", text: "Cliffs of Dover, United Kingdom"}
  ];
  $scope.addSlide = function(image) {
    slides.push({
      image: image.image,
      text: image.text
    });
  };
  for (var i=0; i<img.length; i++) {
    var image = img[i];
    $scope.addSlide(image);
  }

//TODO: logout isnt working when on other pages
  $rootScope.logout = function(){
    service.logout().then(function(data){
      $log.info(data);
      $rootScope.loggedIn = false;
      model.user = {};
      $rootScope.firstname = "";
      $rootScope.lastname = "";
      $location.path('/index');
    }, function(err){
      $log.error(err)
    });
  }
});