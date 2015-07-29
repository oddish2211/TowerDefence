"use strict";

//Global variables
var game;

function Game() {
    var self = this;

    /* Create scene */
    this.scene = new THREE.Scene();

    /* Setup renderer */
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    /* Setup performance counter */
    this.frameCounter = {samples: 0, sum: 0};
    this.logicCounter = {samples: 0, sum: 0};

    /* Create time basis */
    this.frameClock = new THREE.Clock();
    this.logicClock = new THREE.Clock();

    /* Declare camera */
    this.camera;

    /* Create EntityManager to manage entities */
    this.entityManager = new EntityManager(this.scene);

    this.init = function() {
        /* Create camera */
        var camera = new Camera(new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000), 0, 0, 10);
        this.camera = camera.camera;
        this.entityManager.addEntity(camera);

        /* Create map */
        var map0 = new Map(32, 32);
        this.entityManager.addEntity(map0);
        /* Center camera on map */
        camera.position.x = map0.width / 2;
        camera.position.y = map0.length / 2;

        /* Create enemy */
        var enemy0 = new Enemy();
        this.entityManager.addEntity(enemy0);
        /* Center enemy on map */
        enemy0.position.x = map0.width / 2;
        enemy0.position.y = map0.length / 2;

        /* Initialize all entities */
        this.entityManager.entities.forEach(function(entity) {
            entity.init();
        });
    }

    this.render = function() {
        /* Reset logic clock */
        self.logicClock.getDelta();

        requestAnimationFrame(self.render);
        var delta = self.frameClock.getDelta();

        self.entityManager.entities.forEach(function(entity) {
            entity.update(delta);
        });

        self.renderer.render(self.scene, self.camera);

        /* Store logic time */
        self.logicCounter.sum += self.logicClock.getDelta();
        self.logicCounter.samples++;

        /* Store frame time */
        self.frameCounter.sum += delta;
        self.frameCounter.samples++;

        if(self.frameCounter.sum > 1.0) {
            console.log(
                "FPS: " + (1 / (self.frameCounter.sum / self.frameCounter.samples)).toFixed(0) +
                " Frame time: " + (self.frameCounter.sum / self.frameCounter.samples * 1000).toFixed(0) + "ms" +
                " Logic time: " + (self.logicCounter.sum / self.logicCounter.samples * 1000).toFixed(0) + "ms");

            self.logicCounter.sum = 0;
            self.logicCounter.samples = 0;
            self.frameCounter.sum = 0;
            self.frameCounter.samples = 0;
        }
    };

    this.run = function() {
        this.render();
    }

    this.deInit = function() {
         this.entities.forEach(function(entity) {
            entity.deInit();
         });
    }
}

var raycaster = new THREE.Raycaster();
var tileMeshes = [];
var tileHoverCallbacks = [];
var tileDownCallbacks = [];
var lastHoverIndex = -1;
var lastHoverCallback = -1;


/* On hover tile highlight */
registerOnMouseMove(function(position) {
    raycaster.setFromCamera(position, game.camera);

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

    raycaster.setFromCamera(position, game.camera);

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(tileMeshes);

    intersects.forEach(function(intersect) {
        var index = tileMeshes.indexOf(intersect.object);
        if(index != -1) {
            tileDownCallbacks[index]();
        }
    });
});

window.addEventListener('load', initialize);

function initialize() {
    game = new Game();

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousedown", mouseDownHandler, false);
    document.addEventListener("mouseup", mouseUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    game.init();
    game.run();
}
//game.deInit();