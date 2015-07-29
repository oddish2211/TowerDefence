/**
 * Created by pverbrugge on 26/07/15.
 */
"use strict";

function Arrow(origin, direction, velocity) {
    DrawableEntity.call(this);

    this.position.set(origin.x, origin.y, origin.z);

    this.geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    this.material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.direction = new THREE.Vector3(direction.x, direction.y, direction.z);
    this.direction.multiplyScalar(velocity);
}

Arrow.prototype = Object.create(DrawableEntity.prototype);
Arrow.constructor = Arrow;

Arrow.prototype.update = function(delta) {
    var stepVector = new THREE.Vector3(this.direction.x, this.direction.y, this.direction.z)
    stepVector.multiplyScalar(delta);
    this.position.add(stepVector);

    if(this.position.z < 0) {
        game.entityManager.removeEntity(this);
    }

    DrawableEntity.prototype.update.call(this, delta);
};