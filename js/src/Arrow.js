/**
 * Created by pverbrugge on 26/07/15.
 */

Arrow = function(origin, direction, velocity) {
    Entity.call(this);
    var self = this;

    this.geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    this.material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(origin.x, origin.y, origin.z);

    this.direction = new THREE.Vector3(direction.x, direction.y, direction.z);
    this.velocity = velocity;

    this.direction.multiplyScalar(velocity);

    this.update = function(delta) {
        var stepVector = new THREE.Vector3(self.direction.x, self.direction.y, self.direction.z)
        stepVector.multiplyScalar(delta);
        self.mesh.position.add(stepVector);

        if(self.mesh.position.z < 0) {
            removeEntity(self);
        }
    };

    this.load = function(scene) {
        scene.add(self.mesh);
    };

    this.unload = function(scene) {
        scene.remove(self.mesh);
    };
}

Arrow.prototype = Object.create(Entity.prototype);