/**
 * Created by pverbrugge on 26/07/15.
 */
"use strict";

function Arrow(x, y, z, direction, velocity) {
    DrawableEntity.call(this, x, y, z);

    this.geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    this.material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(x, y, z);

    this.direction = new THREE.Vector3(direction.x, direction.y, direction.z);
    this.direction.multiplyScalar(velocity);
}

Arrow.prototype = Object.create(DrawableEntity.prototype);
Arrow.constructor = Arrow;

Arrow.prototype.update = function(delta) {
    var stepVector = new THREE.Vector3(this.direction.x, this.direction.y, this.direction.z)
    stepVector.multiplyScalar(delta);
    this.position.add(stepVector);

    if(this.position.z < 0 || this.position.z > 50) {
        game.entityManager.removeEntity(this);
    }

    var collision = false;
    var collidedMesh = null;

    var nearestEnemies = game.entityManager.getNearestEntities(this.position, Enemy, 3);
    var nearestMeshes = [];
    for(var i = 0; i < nearestEnemies.length; i++) {
        nearestMeshes[i] = nearestEnemies[i].mesh;
    }

    for(var vertexIndex = 0; vertexIndex < this.mesh.geometry.vertices.length; vertexIndex++) {
        var localVertex = this.mesh.geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4(this.mesh.matrix);
        var directionVector = globalVertex.sub(this.mesh.position);

        var ray = new THREE.Raycaster(this.position, directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(nearestMeshes);
        if(collisionResults.length > 0) {
            collision = true;
            collidedMesh = collisionResults[0].object;
        }
    }

    if(collision) {
        console.log("Arrow hit an enemy!");
        nearestEnemies[nearestMeshes.indexOf(collidedMesh)].hit(20);
        game.entityManager.removeEntity(this);
    }

    DrawableEntity.prototype.update.call(this, delta);
};