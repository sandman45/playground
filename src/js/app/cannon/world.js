/**
 * Created by matthew.sanders on 1/31/14.
 */

/**
 * Create Physics World
 *
 */
var world = new CANNON.World();
    world.gravity.set(0,0,-9.82);
    world.broadphase = new CANNON.NaiveBroadphase();
/**/

/**
 * create a Rigid Body
 */
var mass = 5;
var radius = 1;
var sphereShape = new CANNON.Sphere(radius);
var sphereBody = new CANNON.RigidBody(mass,sphereShape);
sphereBody.position.set(0,0,0);
world.add(sphereBody);

/**
 * create static ground plane
 */
var groundShape = new CANNON.Plane();
var groundBody = new CANNON.RigidBody(0,groundShape);
world.add(groundBody);
/**/

var timestep = 1.0/60.0;

world.step(timestep);

setInterval(function(){
    world.step(timestep);

})

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.CubeGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

var render = function () {
    requestAnimationFrame(render);

    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;

    renderer.render(scene, camera);
};

render();