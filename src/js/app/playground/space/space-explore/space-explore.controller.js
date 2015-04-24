/**
 * Created by matthew.sanders on 4/15/15.
 */
controllers.controller('spaceCtrl', //$http,$routParams
  function ($scope, $http, spaceLoader) {


    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    var container, stats;

    var camera, scene, renderer, objects;
    var particleLight;

    init();
    animate();

    function init() {

      container = document.createElement( 'div' );
      document.getElementById("container").appendChild( container );

      camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 2000 );
      camera.position.set( 0, 200, 0 );

      scene = new THREE.Scene();

      // Materials

      var imgTexture2 = THREE.ImageUtils.loadTexture( "js/app/playground/space/space-explore/textures/moon_1024.jpg" );
      imgTexture2.wrapS = imgTexture2.wrapT = THREE.RepeatWrapping;
      imgTexture2.anisotropy = 16;

      var imgTexture = THREE.ImageUtils.loadTexture( "js/app/playground/space/space-explore/textures/lavatile.jpg" );
      imgTexture.repeat.set( 4, 2 );
      imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;
      imgTexture.anisotropy = 16;

      var imgTexture3 = THREE.ImageUtils.loadTexture( "js/app/playground/space/space-explore/textures/planet_cerca_trova_1600.jpg" );
      imgTexture3.repeat.set( 4, 2 );
      imgTexture3.wrapS = imgTexture3.wrapT = THREE.RepeatWrapping;
      imgTexture3.anisotropy = 16;

      var imgTexture4 = THREE.ImageUtils.loadTexture( "js/app/playground/space/space-explore/textures/planet_Terminus1200.png" );
      imgTexture4.repeat.set( 4, 2 );
      imgTexture4.wrapS = imgTexture4.wrapT = THREE.RepeatWrapping;
      imgTexture4.anisotropy = 16;

      var imgTexture5 = THREE.ImageUtils.loadTexture( "js/app/playground/space/space-explore/textures/earth.jpg" );
      imgTexture5.repeat.set( 4, 2 );
      imgTexture5.wrapS = imgTexture5.wrapT = THREE.RepeatWrapping;
      imgTexture5.anisotropy = 16;

      var shininess = 50, specular = 0x333333, bumpScale = 1, shading = THREE.SmoothShading;

      var materials = [];

      materials.push( new THREE.MeshPhongMaterial( { map: imgTexture, bumpMap: imgTexture, bumpScale: bumpScale, color: 0xffffff, specular: specular, shininess: shininess, shading: shading } ) );
      //materials.push( new THREE.MeshPhongMaterial( { map: imgTexture, bumpMap: imgTexture, bumpScale: bumpScale, color: 0x00ff00, specular: specular, shininess: shininess, shading: shading } ) );
      //materials.push( new THREE.MeshPhongMaterial( { map: imgTexture, bumpMap: imgTexture, bumpScale: bumpScale, color: 0x00ff00, specular: specular, shininess: shininess, shading: shading } ) );
      //materials.push( new THREE.MeshPhongMaterial( { map: imgTexture, bumpMap: imgTexture, bumpScale: bumpScale, color: 0x000000, specular: specular, shininess: shininess, shading: shading } ) );
      //
      //materials.push( new THREE.MeshLambertMaterial( { map: imgTexture, color: 0xffffff, shading: shading } ) );
      //materials.push( new THREE.MeshLambertMaterial( { map: imgTexture, color: 0xff0000, shading: shading } ) );
      //materials.push( new THREE.MeshLambertMaterial( { map: imgTexture3, color: 0xffffff, shading: shading } ) );
      //materials.push( new THREE.MeshLambertMaterial( { map: imgTexture5, color: 0xffffff, shading: shading } ) );
      //
      //shininess = 15;
      //
      materials.push( new THREE.MeshPhongMaterial( { map: imgTexture2, bumpMap: imgTexture2, bumpScale: bumpScale, color: 0xffffff, specular: specular, shininess: shininess, metal: false, shading: shading } ) );
      //materials.push( new THREE.MeshPhongMaterial( { map: imgTexture2, bumpMap: imgTexture2, bumpScale: bumpScale, color: 0x000000, specular: 0xaaff00, shininess: shininess, metal: true, shading: shading } ) );
      //materials.push( new THREE.MeshPhongMaterial( { map: imgTexture2, bumpMap: imgTexture2, bumpScale: bumpScale, color: 0x000000, specular: 0x00ffaa, shininess: shininess, metal: true, shading: shading } ) );
      //materials.push( new THREE.MeshPhongMaterial( { map: imgTexture3, bumpMap: imgTexture3, bumpScale: bumpScale, color: 0xffffff, specular: specular, shininess: shininess, metal: false, shading: shading } ) );

      // Spheres geometry

      var geometry_smooth = new THREE.SphereGeometry( 70, 32, 16 );
      var geometry_flat = new THREE.SphereGeometry( 70, 32, 16 );

      objects = [];

      var sphere, geometry, material;

      for ( var i = 0, l = materials.length; i < l; i ++ ) {

        material = materials[ i ];

        geometry = material.shading == THREE.FlatShading ? geometry_flat : geometry_smooth;

        sphere = new THREE.Mesh( geometry, material );

        sphere.position.x = ( i % 4 ) * 200 - 200;
        sphere.position.z = Math.floor( i / 4 ) * 200 - 200;

        objects.push( sphere );

        scene.add( sphere );

      }


      //model
       var model = {
        path:'http://localhost:8081/js/app/playground/space/space-explore/models/tieFighter/starwars-tie-fighter.json',
        texture:'js/app/playground/space/space-explore/models/Spitfire/Spitfire.png'
       };
      for( var j = 0; j < 3; j++){
        var position = {
          x:25*j,
          y:25,
          z:0
        };
        spaceLoader.loadModel(scene, objects, model, position, j);
      }

      particleLight = new THREE.Mesh( new THREE.SphereGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
      scene.add( particleLight );

      // Lights

      scene.add( new THREE.AmbientLight( 0x444444 ) );

      var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
      directionalLight.position.set( 1, 1, 1 ).normalize();
      scene.add( directionalLight );

      var pointLight = new THREE.PointLight( 0xffffff, 2, 800 );
      particleLight.add( pointLight );

      //

      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setClearColor( 0x000000 );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.sortObjects = true;

      container.appendChild( renderer.domElement );

      renderer.gammaInput = true;
      renderer.gammaOutput = true;

      //

      stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.top = '0px';

      container.appendChild( stats.domElement );

      //

      window.addEventListener( 'resize', onWindowResize, false );

    }

    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );

    }

    //

    function animate() {

      requestAnimationFrame( animate );

      render();
      stats.update();

    }

    function render() {

      var timer = Date.now() * 0.00025;
      var timer2 = Date.now() * 0.000025;
      camera.position.x = Math.cos( timer ) * 800;
      camera.position.z = Math.sin( timer ) * 800;

      camera.lookAt( scene.position );

      for ( var i = 0, l = objects.length; i < l; i ++ ) {

        var object = objects[ i ];

        if(object.name === 'tie0'){
          object.position.x = Math.sin( timer2 * 7 ) * 325;
          object.position.y = Math.cos( timer2 * 5 ) * 425;
          object.position.z = Math.cos( timer2 * 3 ) * 325;
        }
        else if(object.name === 'tie1'){
          object.position.x = Math.sin( timer2 * 7 ) * 300;
          object.position.y = Math.cos( timer2 * 5 ) * 400;
          object.position.z = Math.cos( timer2 * 3 ) * 300;
        }
        else if(object.name === 'tie2'){
          object.position.x = Math.sin( timer2 * 7 ) * 350;
          object.position.y = Math.cos( timer2 * 5 ) * 450;
          object.position.z = Math.cos( timer2 * 3 ) * 325;
        }
        else{
          object.rotation.y += 0.005;
        }

      }



      particleLight.position.x = Math.sin( timer * 7 ) * 300;
      particleLight.position.y = Math.cos( timer * 5 ) * 400;
      particleLight.position.z = Math.cos( timer * 3 ) * 300;

      renderer.render( scene, camera );

    }

  });
