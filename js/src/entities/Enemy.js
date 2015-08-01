/**
 * Created by pverbrugge on 25/07/15.
 */
"use strict";

function Enemy(x, y, z) {
    DrawableEntity.call(this, x, y, z);
    var self = this;

    var texture = THREE.ImageUtils.loadTexture(URL_TEXTURES + '/obsidian.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    this.material = new THREE.MeshBasicMaterial({map: texture});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(x, y, z);

    this.health = 100;
}

Enemy.prototype = Object.create(DrawableEntity.prototype);
Enemy.constructor = Enemy;

Enemy.prototype.update = function(delta) {
    /* Do AI stuff to perform movement */
    if(this.position.x < game.map.endTile.position.x) {
        this.velocity.x += 0.2;
    } else if (this.position.y < game.map.endTile.position.y) {
        this.velocity.y += 0.2;
    }

    if(this.health < 0) {
        game.entityManager.removeEntity(this);
        console.log("Enemy killed!");
    }

    /* Update position using parent function */
    DrawableEntity.prototype.update.call(this, delta);
}

Enemy.prototype.hit = function(damage) {
    this.health -= damage;
}