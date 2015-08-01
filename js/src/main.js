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
    this.renderId = -1;

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

    /* Create MapLoader to load map */
    this.mapLoader = new MapLoader();

    this.map = undefined;

    this.render = function() {
        /* Reset logic clock */
        self.logicClock.getDelta();

        self.renderId = requestAnimationFrame(self.render);
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

    this.run = function(map) {
        /* Create camera */
        var camera = new Camera(0, 0, 10, new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000));
        this.camera = camera.camera;
        this.entityManager.addEntity(camera);

        this.map = map;

        /* Add map */
        this.entityManager.addEntity(map);
        /* Center camera on map */
        camera.position.x = map.width / 2;
        camera.position.y = map.length / 2;

        window.setInterval(function() {
            /* Create enemy */
            var enemy0 = new Enemy();
            game.entityManager.addEntity(enemy0);
            /* Center enemy on map */
            enemy0.position.x = game.map.startTile.position.x;
            enemy0.position.y = game.map.startTile.position.y;
        }, 5000);

        /* Initialize all entities */
        this.entityManager.entities.forEach(function(entity) {
            entity.init();
        });

        this.renderId = requestAnimationFrame(this.render);
    };

    this.reset = function() {
        cancelAnimationFrame(this.renderId);
         this.entities.forEach(function(entity) {
            entity.deInit();
         });

        this.entities = [];
    };

    this.resizeHandler = function() {
        console.log("Resizing canvas to " + window.innerWidth + "x" + window.innerHeight);
        self.renderer.setSize(window.innerWidth, window.innerHeight);
    };
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

    /* Resize handler */
    window.addEventListener("resize", game.resizeHandler, false);

    /* Input event handlers */
    window.addEventListener("keydown", keyDownHandler, false);
    window.addEventListener("keyup", keyUpHandler, false);
    window.addEventListener("mousedown", mouseDownHandler, false);
    window.addEventListener("mouseup", mouseUpHandler, false);
    window.addEventListener("mousemove", mouseMoveHandler, false);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var map = game.mapLoader.loadMap(xmlhttp.responseText);
            game.run(map);
        }
    }

    xmlhttp.open("GET", URL_MAPS + "/default.json", true);
    xmlhttp.send();
}
//game.deInit();