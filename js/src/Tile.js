/**
 * Created by pverbrugge on 25/07/15.
 */

Tile = function(x, y) {
    Entity.call(this);
    var self = this;

    this.geometry = new THREE.BoxGeometry(1, 1, 0);

    var defaultTexture = THREE.ImageUtils.loadTexture(URL_TEXTURES + '/dirt.png');
    defaultTexture.magFilter = THREE.NearestFilter;
    defaultTexture.minFilter = THREE.NearestFilter;
    var highlightTexture = THREE.ImageUtils.loadTexture(URL_TEXTURES + '/dirt.png');
    highlightTexture.magFilter = THREE.NearestFilter;
    highlightTexture.minFilter = THREE.NearestFilter;
    var selectTexture = THREE.ImageUtils.loadTexture(URL_TEXTURES + '/stonebrick.png');
    selectTexture.magFilter = THREE.NearestFilter;
    selectTexture.minFilter = THREE.NearestFilter;
    this.material = [
        new THREE.MeshBasicMaterial({map: defaultTexture}),
        new THREE.MeshBasicMaterial({map: highlightTexture}),
        new THREE.MeshBasicMaterial({map: selectTexture})
    ];
    this.mesh = new THREE.Mesh(this.geometry, this.material[0]);
    this.mesh.position.set(x, y, 0);

    this.isSelected = false;

    this.onHover = function(isHovering) {
        if(self.isSelected) {
            return;
        }
        if(isHovering) {
            self.mesh.material = self.material[1];
        } else {
            self.mesh.material = self.material[0];
        }
    };

    this.onSelect = function() {
        if (self.isSelected) {
            self.isSelected = false;
            self.mesh.material = self.material[0];
        } else {
            self.isSelected = true;
            self.mesh.material = self.material[2];

            if(self.entity == undefined) {
                console.log("Selected tile " + self.mesh.position.x + "," + self.mesh.position.y + " contains nothing");
            } else {
                console.log("Selected tile " + self.mesh.position.x + "," + self.mesh.position.y + " contains entity");
            }
        }
    }

    this.place = function(entity) {
        self.entity = entity;
        self.entity.mesh.position.x = self.mesh.position.x;
        self.entity.mesh.position.y = self.mesh.position.y;
    }

    this.update = function(delta) {

    };

    this.load = function(scene) {
        scene.add(self.mesh);
    };

    this.unload = function(scene) {
        scene.remove(self.mesh);
    };
}

Tile.prototype = Object.create(Entity.prototype);