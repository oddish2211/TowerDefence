/**
 * Created by pverbrugge on 29/07/15.
 */
"use strict";

function EntityManager(scene) {
    this.entities = [];
};

EntityManager.prototype.addEntity = function(entity) {
    entity.init();
    this.entities.push(entity);
};

EntityManager.prototype.addEntities = function(entities) {
    var self = this;
    entities.forEach(function(entity) {
        entity.init();
        self.entities.push(entity);
    })
}

EntityManager.prototype.removeEntity = function(entity) {
    entity.deInit();

    var index = this.entities.indexOf(entity);
    if(index > -1) {
        this.entities.splice(index, 1);
    }
};

EntityManager.prototype.getNearestEntity = function(position, className, maxRange) {
    var className = className || Entity;
    var maxRange = maxRange || Number.POSITIVE_INFINITY;

    var nearestEntity;
    var nearestEntityDistance;
    this.entities.forEach(function(entity) {
        var distance = position.distanceTo(entity.position);
        if(entity instanceof className && distance < maxRange && (!nearestEntity || distance < nearestEntityDistance)) {
            nearestEntity = entity;
            nearestEntityDistance = distance;
        }
    });
    return nearestEntity;
};

EntityManager.prototype.getNearestEntities = function(position, className, maxRange) {
    var className = className || Entity;
    var maxRange = maxRange || Number.POSITIVE_INFINITY;

    var nearestEntities = []
    this.entities.forEach(function(entity) {
        var distance = position.distanceTo(entity.position);
        if(entity instanceof className && distance < maxRange) {
            nearestEntities.push(entity);
        }
    });
    return nearestEntities;
};

EntityManager.prototype.doesEntityExist = function(entity) {
    return(this.entities.indexOf(entity) !== -1);
};