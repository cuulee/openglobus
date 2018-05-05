/**
 * @module og/control/ZoomControl
 */

'use strict';

import { Control } from './Control.js';
import { Key } from '../Lock.js';

/**
 * Planet zoom buttons control.
 * @class
 * @extends {og.control.Control}
 * @params {Object} [options] - Control options.
 */
class ZoomControl extends Control {
    constructor(options) {
        super(options);

        options = options || {};

        this._keyLock = new Key();

        this.planet = null;

        this._move = 0;
    }

    oninit() {
        var zoomDiv = document.createElement('div'),
            btnZoomIn = document.createElement('button'),
            btnZoomOut = document.createElement('button');

        zoomDiv.className = 'ogZoomControl';
        btnZoomIn.className = 'ogZoomButton ogZoomIn';
        btnZoomOut.className = 'ogZoomButton ogZoomOut';

        zoomDiv.appendChild(btnZoomIn);
        zoomDiv.appendChild(btnZoomOut);

        this.renderer.div.appendChild(zoomDiv);

        btnZoomIn.addEventListener("mousedown", (e) => this.zoomIn());
        btnZoomIn.addEventListener("mouseup", (e) => this.stopZoom());

        btnZoomOut.addEventListener("mousedown", (e) => this.zoomOut());
        btnZoomOut.addEventListener("mouseup", (e) => this.stopZoom());

        this.renderer.events.on("draw", this._draw, this);
    }

    /** 
     * Planet zoom in.
     * @public
     */
    zoomIn() {

        this.planet.layerLock.lock(this._keyLock);
        this.planet.terrainLock.lock(this._keyLock);
        this.planet._normalMapCreator.lock(this._keyLock);

        this._targetPoint = this.renderer.getCenter();

        this._move = 1;
    }

    /** 
     * Planet zoom out.
     * @public
     */
    zoomOut() {

        this.planet.layerLock.lock(this._keyLock);
        this.planet.terrainLock.lock(this._keyLock);
        this.planet._normalMapCreator.lock(this._keyLock);

        this._targetPoint = this.renderer.getCenter();
        this._move = -1;
    }

    stopZoom() {

        this._move = 0;

        this.planet.layerLock.free(this._keyLock);
        this.planet.terrainLock.free(this._keyLock);
        this.planet._normalMapCreator.free(this._keyLock);
    }

    _draw(e) {

        var cam = this.renderer.activeCamera;

        if (this._move !== 0) {
            var d = cam.eye.distance(
                this.planet.getCartesianFromPixelTerrain(this._targetPoint, true)) * 0.075;
            cam.eye.addA(cam.getForward().scale(this._move * d));
            cam.update();
        }
    }
}

export function zoomControl(options) {
    return new ZoomControl(options);
}

export { ZoomControl };
