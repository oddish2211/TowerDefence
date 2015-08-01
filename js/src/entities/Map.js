/**
 * Created by pverbrugge on 28/07/15.
 */
"use strict";

function Map(width, length) {
    Entity.call(this, 0, 0, 0);

    this.width = width;
    this.length = length;

    this.tiles = [];

    this.startTile = undefined;
    this.endTile = undefined;
};

Map.prototype = Object.create(Entity.prototype);
Map.constructor = Map;

Map.prototype.init = function() {
    game.entityManager.addEntities(this.tiles);
};

Map.prototype.deInit = function() {
    this.tiles.forEach(function(tile) {
        game.entityManager.removeEntity(tile);
    })
};