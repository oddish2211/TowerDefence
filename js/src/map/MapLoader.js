/**
 * Created by pverbrugge on 31/07/15.
 */
"use strict";

function MapLoader() {

};

MapLoader.prototype.loadMap = function(json) {
    var mapData = JSON.parse(json);
    var map = new Map(0, 0, 0, mapData.map.width, mapData.map.length);
    mapData.map.tiles.forEach(function(tile) {
        var gameTile = new Tile(tile.x, tile.y, 0, tile.type);
        tileMeshes.push(gameTile.mesh);
        tileHoverCallbacks.push(gameTile.onHover);
        tileDownCallbacks.push(gameTile.onSelect);
        map.tiles.push(gameTile);

        if(tile.object) {
            var tower = new Tower(0, 0, 0);
            gameTile.place(tower);
            game.entityManager.addEntity(tower);
        }

        if(tile.start) {
            map.startTile = gameTile;
        }

        if(tile.end) {
            map.endTile = gameTile;
        }
    });

    return map;
};