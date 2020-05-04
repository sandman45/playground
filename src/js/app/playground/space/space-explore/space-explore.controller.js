/**
 * Created by matthew.sanders on 4/15/15.
 */
controllers.controller('spaceCtrl', //$http,$routParams
  function ($scope, $http, spaceLoader) {

    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    let container, stats;
    const backendUrl = 'http://playground.mattsanders.org';
    // const backendUrl = 'http://localhost:3000';
    let camera, scene, renderer, objects;
    let particleLight;
    let flyby = false;
    let tiePosition = {
      x: 20,
      y: 30,
      z: 40
    };
    setTimeout(() => {
      init();
      animate();
      // onWindowResize();
    }, 1000);



    function onWindowResize() {
      const canvasContainer = document.getElementById("space-container").getBoundingClientRect();
      const width = canvasContainer.width;
      const height = canvasContainer.height;
      console.log(`height: ${height}, width: ${width}`);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize( width, height );
    }

    function init() {

      container = document.getElementById( 'scene' );
      const canvasContainer = document.getElementById("space-container").getBoundingClientRect();
      const width = canvasContainer.width;
      let height = canvasContainer.height;
      // alert(`width: ${width}, height: ${height}`);
      if(height === 0) {
        height = 600;
      }
      camera = new THREE.PerspectiveCamera( 40, width / height, 1, 2000 );
      camera.position.set( 0, 200, 0 );

      scene = new THREE.Scene();

      // Materials
      THREE.ImageUtils.crossOrigin = "";
      // const imgTexture2 = THREE.ImageUtils.loadTexture( "js/app/playground/space/space-explore/textures/moon_1024.jpg" );
      // imgTexture2.wrapS = imgTexture2.wrapT = THREE.RepeatWrapping;
      // imgTexture2.anisotropy = 16;


      const imgTexture = THREE.ImageUtils.loadTexture( "js/app/playground/space/space-explore/textures/lavatile.jpg" );
      imgTexture.repeat.set( 4, 2 );
      imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;
      imgTexture.anisotropy = 16;

      // const imgTexture3 = THREE.ImageUtils.loadTexture( "js/app/playground/space/space-explore/textures/planet_cerca_trova_1600.jpg" );
      // imgTexture3.repeat.set( 4, 2 );
      // imgTexture3.wrapS = imgTexture3.wrapT = THREE.RepeatWrapping;
      // imgTexture3.anisotropy = 16;

      // const imgTexture4 = THREE.ImageUtils.loadTexture( "js/app/playground/space/space-explore/textures/planet_Terminus1200.png" );
      // imgTexture4.repeat.set( 4, 2 );
      // imgTexture4.wrapS = imgTexture4.wrapT = THREE.RepeatWrapping;
      // imgTexture4.anisotropy = 16;

      // const imgTexture5 = THREE.ImageUtils.loadTexture( "js/app/playground/space/space-explore/textures/earth.jpg" );
      // imgTexture5.repeat.set( 4, 2 );
      // imgTexture5.wrapS = imgTexture5.wrapT = THREE.RepeatWrapping;
      // imgTexture5.anisotropy = 16;

      const shininess = 50, specular = 0x333333, bumpScale = 1, shading = THREE.SmoothShading;

      const materials = [];

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
      //materials.push( new THREE.MeshPhongMaterial( { map: imgTexture2, bumpMap: imgTexture2, bumpScale: bumpScale, color: 0xffffff, specular: specular, shininess: shininess, metal: false, shading: shading } ) );
      //materials.push( new THREE.MeshPhongMaterial( { map: imgTexture2, bumpMap: imgTexture2, bumpScale: bumpScale, color: 0x000000, specular: 0xaaff00, shininess: shininess, metal: true, shading: shading } ) );
      //materials.push( new THREE.MeshPhongMaterial( { map: imgTexture2, bumpMap: imgTexture2, bumpScale: bumpScale, color: 0x000000, specular: 0x00ffaa, shininess: shininess, metal: true, shading: shading } ) );
      //materials.push( new THREE.MeshPhongMaterial( { map: imgTexture3, bumpMap: imgTexture3, bumpScale: bumpScale, color: 0xffffff, specular: specular, shininess: shininess, metal: false, shading: shading } ) );

      // Spheres geometry

      const geometry_smooth = new THREE.SphereGeometry( 70, 32, 16 );
      const geometry_flat = new THREE.SphereGeometry( 70, 32, 16 );

      objects = [];

      let sphere, geometry, material;

      for ( let i = 0, l = materials.length; i < l; i ++ ) {

        material = materials[ i ];

        geometry = material.shading == THREE.FlatShading ? geometry_flat : geometry_smooth;

        sphere = new THREE.Mesh( geometry, material );
        sphere.name = "planet";
        sphere.position.x = 0;//( i % 4 ) * 200 - 200;
        sphere.position.z = 0;//Math.floor( i / 4 ) * 200 - 200;
        sphere.position.y = 0;
        objects.push( sphere );

        scene.add( sphere );

      }


      //model
       const model = {
        path:`${backendUrl}/js/app/playground/space/space-explore/models/tieFighter/starwars-tie-fighter.json`,
        texture:'js/app/playground/space/space-explore/models/Spitfire/Spitfire.png'
       };
      console.log(`space-explore-controller-${model.path}`);

      for( let j = 0; j < 3; j++){
        const position = {
          x:25*j,
          y:25,
          z:0
        };
        spaceLoader.loadModel(scene, objects, model, position, j, 'tie-squad-1-' + j);
      }

      for( let e = 0; e < 3; e++){
        const position = {
          x:400 + (e * 2),
          y:175,
          z:400
        };
        spaceLoader.loadModel(scene, objects, model, position, e, 'tie-squad-2-' + e);
      }

      // has cross origin errors for the textures
      // const model2 = {
      //   path:`${backendUrl}/js/app/playground/space/space-explore/models/mFalcon/starwars-millennium-falcon.json`,
      //   texture:'js/app/playground/space/space-explore/models/Spitfire/Spitfire.png'
      // };
      //
      // spaceLoader.loadModel(scene, objects, model2, {x:200,y:150,z:150}, 5, 'falcon');



      //----Grid Board-------//
      const matrix = [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0]
      ];

      //// plane
      //const plane = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshNormalMaterial());
      //plane.overdraw = true
      //plane.name = 'gridBoard';
      //plane.rotation.z = 0;
      //plane.rotation.x = 90;
      //plane.rotation.y = 0;
      //scene.add( plane );


      particleLight = new THREE.Mesh( new THREE.SphereGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
      scene.add( particleLight );

      // Lights

      scene.add( new THREE.AmbientLight( 0x444444 ) );

      const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
      directionalLight.position.set( 1, 1, 1 ).normalize();
      scene.add( directionalLight );

      const pointLight = new THREE.PointLight( 0xffffff, 2, 800 );
      //particleLight.add( pointLight );

      //

      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setClearColor( 0x000000 );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( width, height );
      renderer.sortObjects = true;

      container.appendChild( renderer.domElement );

      renderer.gammaInput = true;
      renderer.gammaOutput = true;

      //

      // stats = new Stats();
      // stats.domElement.style.position = 'absolute';
      // stats.domElement.style.top = '0px';
      //
      // container.appendChild( stats.domElement );

      //

      window.addEventListener( 'resize', onWindowResize, false );

    }



    //

    function animate() {

      requestAnimationFrame( animate );

      render();
      // stats.update();

    }

    function render() {

      const timer = Date.now() * 0.00025;
      const timer2 = Date.now() * 0.000025;
      // camera.position.x = Math.cos( timer ) * 400;
      // camera.position.z = Math.sin( timer ) * 400;
      camera.position.x = 400;
      camera.position.z = 400;
      camera.lookAt( scene.position );

      for ( let i = 0, l = objects.length; i < l; i ++ ) {

        const object = objects[ i ];

        if(object.name === 'tie-squad-1-0'){
          object.position.x = Math.sin( timer2 * 7 ) * 325;
          object.position.y = Math.cos( timer2 * 5 ) * 425;
          object.position.z = Math.cos( timer2 * 3 ) * 325;
        }
        else if(object.name === 'tie-squad-1-1'){
          object.position.x = Math.sin( timer2 * 7 ) * 300;
          object.position.y = Math.cos( timer2 * 5 ) * 400;
          object.position.z = Math.cos( timer2 * 3 ) * 300;
        }
        else if(object.name === 'tie-squad-1-2'){
          object.position.x = Math.sin( timer2 * 7 ) * 350;
          object.position.y = Math.cos( timer2 * 5 ) * 450;
          object.position.z = Math.cos( timer2 * 3 ) * 325;
        }

        if(object.name === 'falcon'){
          object.position.x = Math.sin( timer2 * 7 ) * 150;
          object.position.y = Math.cos( timer2 * 5 ) * 350;
          object.position.z = Math.cos( timer2 * 3 ) * 450;
        }

        else if(object.name === "planet"){
          object.rotation.y += 0.005;
        }


        // START fly by
        if (flyby) {
          if(object.name === 'tie-squad-2-0'){
            object.position.x -= 2;
            // object.position.y -= 10;
            object.position.z -= 2;
          }
          else if(object.name === 'tie-squad-2-1'){
            object.position.x -= 2;
            // object.position.y -= 10;
            object.position.z -= 2;
          }
          else if(object.name === 'tie-squad-2-2'){
            object.position.x -= 2;
            // object.position.y -= 10;
            object.position.z -= 2;
          }
        } else {
          if(object.name === 'tie-squad-2-0'){
            object.position.x = tiePosition.x;
            // object.position.y -= 10;
            object.position.z = tiePosition.z;
          }
          else if(object.name === 'tie-squad-2-1'){
            object.position.x = tiePosition.x + 10;
            // object.position.y -= 10;
            object.position.z = tiePosition.z;
          }
          else if(object.name === 'tie-squad-2-2'){
            object.position.x = tiePosition.x + 20;
            // object.position.y -= 10;
            object.position.z = tiePosition.z;
          }
        }


      }



      //particleLight.position.x = Math.sin( timer * 7 ) * 300;
      //particleLight.position.y = Math.cos( timer * 5 ) * 400;
      //particleLight.position.z = Math.cos( timer * 3 ) * 300;

      renderer.render( scene, camera );

    }



    $scope.reposition = (type) => {
      if (type === 1) {
        flyby = true;
      }
    };

    $scope.reset = (type) => {
      if (type === 1) {
        tiePosition.x = 400;
        tiePosition.y = 10;
        tiePosition.z = 400;
        flyby = false;
      }
    };


  });
