/* Create scene */
var scene = new THREE.Scene();

/* Setup renderer */
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* Create camera */
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

/* Create cube */
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

/* Create time basis */
var clock = new THREE.Clock();
var delta;

var render = function () {
	requestAnimationFrame(render);
    delta = clock.getDelta();

	cube.rotation.x += delta * 1.0;
	cube.rotation.y += delta * 1.0;

	renderer.render(scene, camera);
};

render();