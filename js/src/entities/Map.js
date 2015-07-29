/**
 * Created by pverbrugge on 28/07/15.
 */
"use strict";

function Map(width, length) {
    Entity.call(this);

    this.width = width;
    this.length = length;

    this.tiles = [];
    /* Create entities list */
    for(var y = 0; y < length; y++) {
        for(var x = 0; x < width; x++) {
            var tile = new Tile(x, y);
            tileMeshes.push(tile.mesh);
            tileHoverCallbacks.push(tile.onHover);
            tileDownCallbacks.push(tile.onSelect);

            /*
            //if(x == -2 && y == -2) {
            if(Math.random() * 32 > 30) {
                var tower = new Tower();
                tile.place(tower);
                game.entityManager.addEntity(tower);
            }
            */
            this.tiles.push(tile);
        }
    }
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