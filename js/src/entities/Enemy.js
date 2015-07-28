/**
 * Created by pverbrugge on 25/07/15.
 */

Enemy = function() {
    Entity.call(this);
    var self = this;

    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    var texture = THREE.ImageUtils.loadTexture(URL_TEXTURES + '/obsidian.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    this.material = new THREE.MeshBasicMaterial({map: texture});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 0, 0);

    this.update = function(delta) {

    };

    this.load = function(scene) {
        scene.add(self.mesh);
    };

    this.unload = function(scene) {
        scene.remove(self.mesh);
    };
}

Enemy.prototype = Object.create(Entity.prototype);