/**
 * Created by matthew.sanders on 1/31/14.
 */
controllers.controller('worldCtrl', ['$scope',//$http,$routParams
    function ($scope, $http) {
        $scope.title = 'WORLD!!!!!!';


      var demo = new CANNON.Demo({container:'cannonWorld'});
      var size = 1;
      var interval;

      // Spheres
      demo.addScene("Pile",function(){
        if(interval) clearInterval(interval);

        var world = demo.getWorld();

        world.gravity.set(0,0,-50);
        world.broadphase = new CANNON.NaiveBroadphase();
        world.solver.iterations = 5;

        world.defaultContactMaterial.contactEquationStiffness = 5e6;
        world.defaultContactMaterial.contactEquationRegularizationTime = 10;

        // Since we have many bodies and they don't move very much, we can use the less accurate quaternion normalization
        world.quatNormalizeFast = true;
        world.quatNormalizeSkip = 4; // ...and we do not have to normalize every step.

        // ground plane
        var groundShape = new CANNON.Plane(new CANNON.Vec3(0,0,1));
        var groundBody = new CANNON.RigidBody(0,groundShape);
        groundBody.position.set(0,0,0);
        world.add(groundBody);
        demo.addVisual(groundBody);

        // plane -x
        var planeShapeXmin = new CANNON.Plane();
        var planeXmin = new CANNON.RigidBody(0, planeShapeXmin);
        planeXmin.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),Math.PI/2);
        planeXmin.position.set(-5,0,0);
        world.add(planeXmin);

        // Plane +x
        var planeShapeXmax = new CANNON.Plane();
        var planeXmax = new CANNON.RigidBody(0, planeShapeXmax);
        planeXmax.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),-Math.PI/2);
        planeXmax.position.set(5,0,0);
        world.add(planeXmax);

        // Plane -y
        var planeShapeYmin = new CANNON.Plane();
        var planeYmin = new CANNON.RigidBody(0, planeShapeYmin);
        planeYmin.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
        planeYmin.position.set(0,-5,0);
        world.add(planeYmin);

        // Plane +y
        var planeShapeYmax = new CANNON.Plane();
        var planeYmax = new CANNON.RigidBody(0, planeShapeYmax);
        planeYmax.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),Math.PI/2);
        planeYmax.position.set(0,5,0);
        world.add(planeYmax);

        var bodies = [];
        var i = 0;
        interval = setInterval(function(){
          // Sphere
          i++;
          var sphereShape = new CANNON.Sphere(size);
          var b1 = new CANNON.RigidBody(5,sphereShape);
          b1.position.set(2*size*Math.sin(i),2*size*Math.cos(i),7*2*size);
          world.add(b1);
          demo.addVisual(b1);
          bodies.push(b1);

          if(bodies.length>80){
            var b = bodies.shift();
            demo.removeVisual(b);
            world.remove(b);
          }
        },100);
      });

      demo.start();


    }]);