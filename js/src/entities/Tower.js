/**
 * Created by pverbrugge on 25/07/15.
 */
"use strict";

function Tower() {
    DrawableEntity.call(this);

    this.position.setZ(1);

    this.geometry = new THREE.BoxGeometry(1, 1, 2);
    var texture = THREE.ImageUtils.loadTexture(URL_TEXTURES + '/sand.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    this.material = new THREE.MeshBasicMaterial({map: texture});
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.reloadCounter = 0;

    this.range = 5;

    this.target;
}

Tower.prototype = Object.create(DrawableEntity.prototype);
Tower.constructor = Tower;

Tower.prototype.update = function(delta) {
    this.reloadCounter += delta;

    if(this.target == undefined || this.target.position.distanceTo(this.position) > this.range) {
        this.target = game.entityManager.getNearestEntity(this.position, Enemy, this.range)
    }

    if(this.target && this.reloadCounter > 2) {
        this.reloadCounter = 0;
        var directionVector = new THREE.Vector3(this.target.position.x, this.target.position.y, this.target.position.z);
        directionVector.sub(this.position);
        directionVector.normalize();
        var arrow = new Arrow(this.position, directionVector, 40);
        game.entityManager.addEntity(arrow);
    }

    /* Update position using parent function */
    DrawableEntity.prototype.update.call(this, delta);
};