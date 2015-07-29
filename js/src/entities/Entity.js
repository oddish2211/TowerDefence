/**
 * Created by pverbrugge on 22/07/15.
 */
"use strict";

function Entity() {
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
}

Entity.prototype.update = function(delta) {
    /* Friction */
    this.velocity.x -= this.velocity.x * 15 * delta;
    this.velocity.y -= this.velocity.y * 15 * delta;
    this.velocity.z -= this.velocity.z * 15 * delta;

    /* Update position */
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
    this.position.z += this.velocity.z * delta;
};

Entity.prototype.init = function() {};
Entity.prototype.deInit = function() {};

function DrawableEntity() {
    Entity.call(this);

    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
};

DrawableEntity.prototype = Object.create(Entity.prototype);
DrawableEntity.constructor = DrawableEntity;

DrawableEntity.prototype.update = function(delta) {
    /* Update position using parent function */
    Entity.prototype.update.call(this, delta);
    /* Update mesh position */
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
}

DrawableEntity.prototype.init = function() {
    game.scene.add(this.mesh);
};

DrawableEntity.prototype.deInit = function() {
    game.scene.remove(this.mesh);
};