/**
 * Created by pverbrugge on 22/07/15.
 */
"use strict";

function EntityManager(scene) {
    this.scene = scene;
    this.entities = [];

    this.addEntity = function(entity, performLoad) {
        performLoad = performLoad !== false;

        if(performLoad) {
            entity.load(this.scene);
        }
        this.entities.push(entity);
    }

    this.removeEntity = function(entity, performUnload) {
        performUnload = performUnload !== false;

        if(performUnload) {
            entity.unload(this.scene);
        }

        var index = this.entities.indexOf(entity);
        if(index > -1) {
            this.entities.splice(index, 1);
        }
    }
};

function Entity() {
    this.loaded = false;

    this.update = function(delta) {

    };

    this.load = function(scene) {
        this.loaded = true;
    };

    this.unload = function(scene) {
        this.loaded = false;
    };
};