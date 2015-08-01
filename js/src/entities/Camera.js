/**
 * Created by pverbrugge on 29/07/15.
 */
"use strict";

function Camera(x, y, z, camera) {
    Entity.call(this, x, y, z);

    this.camera = camera;
    this.camera.position.set(x, y, z);
};

Camera.prototype = Object.create(Entity.prototype);
Camera.constructor = Camera;

Camera.prototype.init = function() {
    game.scene.add(this.camera);
};

Camera.prototype.deInit = function() {
    game.scene.remove(this.camera);
};

Camera.prototype.update = function(delta) {
    /* User control */
    if(keyStates[KEY.W].state) {
        this.velocity.y += CAMERA_VELOCITY;
    } else if(keyStates[KEY.S].state) {
        this.velocity.y -= CAMERA_VELOCITY;
    }

    if(keyStates[KEY.A].state) {
        this.velocity.x -= CAMERA_VELOCITY;
    } else if(keyStates[KEY.D].state) {
        this.velocity.x += CAMERA_VELOCITY;
    }

    if(keyStates[KEY.E].state) {
        this.velocity.z -= CAMERA_VELOCITY;
    } else if(keyStates[KEY.Q].state) {
        this.velocity.z += CAMERA_VELOCITY;
    }

    /* Update position using parent function */
    Entity.prototype.update.call(this, delta);

    /* Update position of components */
    this.camera.position.set(this.position.x, this.position.y, this.position.z);
};