/**
 * Created by pverbrugge on 25/07/15.
 */
"use strict";

function Tile(x, y) {
    DrawableEntity.call(this);
    var self = this;

    this.position.set(x, y, 0);

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
    };
}

Tile.prototype = Object.create(DrawableEntity.prototype);
Tile.constructor = Tile;

Tile.prototype.place = function(entity) {
    this.entity = entity;
    this.entity.position.x = this.position.x;
    this.entity.position.y = this.position.y;
};

Tile.prototype.update = function(delta) {
    /* Update position using parent function */
    DrawableEntity.prototype.update.call(this, delta);
}