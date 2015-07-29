/**
 * Created by pverbrugge on 25/07/15.
 */
"use strict";

function Enemy() {
    DrawableEntity.call(this);
    var self = this;

    var texture = THREE.ImageUtils.loadTexture(URL_TEXTURES + '/obsidian.png');
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    this.material = new THREE.MeshBasicMaterial({map: texture});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
}

Enemy.prototype = Object.create(DrawableEntity.prototype);
Enemy.constructor = Enemy;

Enemy.prototype.update = function(delta) {
    /* Alter velocity based on user input */
    if(keyStates[KEY.UP].state) {
        this.velocity.y += 100 * delta;
    } else if(keyStates[KEY.DOWN].state) {
        this.velocity.y -= 100 * delta;
    }

    if(keyStates[KEY.LEFT].state) {
        this.velocity.x -= 100 * delta;
    } else if(keyStates[KEY.RIGHT].state) {
        this.velocity.x += 100 * delta;
    }

    /* Update position using parent function */
    DrawableEntity.prototype.update.call(this, delta);
}