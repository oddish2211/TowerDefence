/* Create scene */
var scene = new THREE.Scene();

/* Setup renderer */
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* Setup key events */
var keyStates = [];
for(var i = 0; i < 200; i++) {
    keyStates.push({state : false, time : 0});
}

var keyDownHandler = function(event) {
    event.preventDefault();
    var keyCode = event.which;
    var time = new Date();
    keyStates[keyCode] = {state : true, time : time.getTime()};

    console.log("Keyboard button " + keyCode + " pressed : " + time.toLocaleTimeString());
}

var keyUpHandler = function(event) {
    event.preventDefault();
    var keyCode = event.which;
    var time = new Date();
    keyStates[keyCode] = {state : false, time : time.getTime()};

    console.log("Keyboard button " + keyCode + " released : " + time.toLocaleTimeString());
}

/* Setup mouse events */
var mousePosition = {x : 0, y : 0};
var mouseMoveCallbacks = [];
var mouseMoveHandler = function() {
    event.preventDefault();
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (event.clientY / window.innerHeight) * 2 + 1;

    mouseMoveCallbacks.forEach(function(callback) {
        callback(mousePosition);
    });
    //console.log("Mouse moved to " + mousePosition.x + "," + mousePosition.y);
}

var registerOnMouseMove = function(callback) {
    mouseMoveCallbacks.push(callback);
}


var buttonStates = [];
for(var i = 0; i < 3; i++) {
    buttonStates.push({state : false, time : 0});
}

var mouseDownCallbacks = [];
var mouseDownHandler = function(event) {
    event.preventDefault();
    var buttonCode = event.button;
    var time = new Date();
    buttonStates[buttonCode] = {state : true, time : time.getTime()};
/*
    console.log("Mouse button " + buttonCode +
        " pressed at " + mousePosition.x.toFixed(2) + "," + mousePosition.y.toFixed(2) +
        ": " + time.toLocaleTimeString());
*/
    mouseDownCallbacks.forEach(function(callback) {
        callback(mousePosition, buttonCode);
    });
}

var registerOnMouseDown = function(callback) {
    mouseDownCallbacks.push(callback);
}

var mouseUpCallbacks = [];
var mouseUpHandler = function(event) {
    event.preventDefault();
    var buttonCode = event.button;
    var time = new Date();
    buttonStates[buttonCode] = {state : false, time : time.getTime()};
/*
    console.log("Mouse button " + buttonCode +
        " released at " + mousePosition.x.toFixed(2) + "," + mousePosition.y.toFixed(2) +
        ": " + time.toLocaleTimeString());
*/
    mouseUpCallbacks.forEach(function(callback) {
        callback(mousePosition, buttonCode);
    });
}

var registerOnMouseUp = function(callback) {
    mouseUpCallbacks.push(callback);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);
document.addEventListener("mouseup", mouseUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

/* Create camera */
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 10;
var velocity = new THREE.Vector3();

/* Create time basis */
var clock = new THREE.Clock();
var delta;

var raycaster = new THREE.Raycaster();
var tileMeshes = [];
var tileHoverCallbacks = [];
var tileDownCallbacks = [];
var lastHoverIndex = -1;
var lastHoverCallback = -1;


/* On hover tile highlight */
registerOnMouseMove(function(position) {
    raycaster.setFromCamera(position, camera);

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(tileMeshes);

    intersects.forEach(function(intersect) {
        var index = tileMeshes.indexOf(intersect.object);
        if(index != -1 && index != lastHoverIndex) {
            try {
                lastHoverCallback(false);
            } catch(error) {

            }
            tileHoverCallbacks[index](true);
            lastHoverCallback = tileHoverCallbacks[index];
        }
    });
});

/* On hover tile select */
registerOnMouseDown(function(position, buttonCode) {
    if(BUTTON.LEFT != buttonCode) {
        return;
    }

    raycaster.setFromCamera(position, camera);

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(tileMeshes);

    intersects.forEach(function(intersect) {
        var index = tileMeshes.indexOf(intersect.object);
        if(index != -1) {
            tileDownCallbacks[index]();
        }
    });
});

/* Create entities list */
var entities = [];
for(var y = -8; y < 9; y++) {
    for(var x = -8; x < 9; x++) {
        var tile = new Tile(x, y);
        tileMeshes.push(tile.mesh);
        tileHoverCallbacks.push(tile.onHover);
        tileDownCallbacks.push(tile.onSelect);
        entities.push(tile);

        //if(x == -2 && y == -2) {
        if(Math.random() * 32 > 30) {
            var tower = new Tower();
            tile.place(tower);
            entities.push(tower);
        }
    }
}

var enemies = []
var enemy0 = new Enemy();

enemies.push(enemy0);
entities.push(enemy0);

getNearestEnemy = function(position) {
    var target;
    enemies.forEach(function(enemy) {
        if(!target || position.distanceTo(enemy.mesh.position) < position.distanceTo(target.mesh.position)) {
            target = enemy;
        }
    });
    return target;
};

addEntity = function(entity) {
    entity.load(scene);
    entities.push(entity);
}

removeEntity = function(entity) {
    entity.unload(scene);

    var index = entities.indexOf(entity);
    if(index > -1) {
        entities.splice(index, 1);
    }
}

var render = function () {
	requestAnimationFrame(render);
    delta = clock.getDelta();

    velocity.x -= velocity.x * 20.0 * delta;
    velocity.y -= velocity.y * 20.0 * delta;
    velocity.z -= velocity.z * 20.0 * delta;

	/* Set events for specific entities */
	if(keyStates[KEY.W].state) {
		velocity.y += CAMERA_VELOCITY;
	} else if(keyStates[KEY.S].state) {
		velocity.y -= CAMERA_VELOCITY;
	}

	if(keyStates[KEY.A].state) {
		velocity.x -= CAMERA_VELOCITY;
	} else if(keyStates[KEY.D].state) {
		velocity.x += CAMERA_VELOCITY;
	}

    if(keyStates[KEY.E].state) {
        velocity.z -= CAMERA_VELOCITY;
    } else if(keyStates[KEY.Q].state) {
        velocity.z += CAMERA_VELOCITY;
    }

	camera.position.x += velocity.x * delta;
	camera.position.y += velocity.y * delta;
    camera.position.z += velocity.z * delta;

    if(keyStates[KEY.UP].state) {
        enemy0.mesh.position.y += 1 * delta;
    } else if(keyStates[KEY.DOWN].state) {
        enemy0.mesh.position.y -= 1 * delta;
    }

    if(keyStates[KEY.LEFT].state) {
        enemy0.mesh.position.x += 1 * delta;
    } else if(keyStates[KEY.RIGHT].state) {
        enemy0.mesh.position.x -= 1 * delta;
    }

	entities.forEach(function(entity) {
		entity.update(delta);
	});

	renderer.render(scene, camera);
};

entities.forEach(function(entity) {
	entity.load(scene);
});

render();
/*
entities.forEach(function(entity) {
	entity.unload(scene);
});
*/