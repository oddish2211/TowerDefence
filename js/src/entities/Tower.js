/**
 * Created by pverbrugge on 25/07/15.
 */

Tower = function() {
    Entity.call(this);
    var self = this;

    this.geometry = new THREE.BoxGeometry(1, 1, 2);
    var texture = THREE.ImageUtils.loadTexture(URL_TEXTURES + '/sand.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    this.material = new THREE.MeshBasicMaterial({map: texture});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 0, 1);

    this.counter = 0;

    this.update = function(delta) {
        self.counter += delta;
        var target = getNearestEnemy(self.mesh.position);

        if(target && self.counter > 2) {
            self.counter = 0;
            var direction = new THREE.Vector3(target.mesh.position.x, target.mesh.position.y, target.mesh.position.z);
            direction.sub(self.mesh.position);
            direction.normalize();
            var arrow = new Arrow(self.mesh.position, direction, 40);
            entityManager.addEntity(arrow);
        }
    };

    this.load = function(scene) {
        scene.add(self.mesh);
    };

    this.unload = function(scene) {
        scene.remove(self.mesh);
    };
}

Tower.prototype = Object.create(Entity.prototype);