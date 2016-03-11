/**
 * @preserve
 *
 *                                      .,,,;;,'''..
 *                                  .'','...     ..',,,.
 *                                .,,,,,,',,',;;:;,.  .,l,
 *                               .,',.     ...     ,;,   :l.
 *                              ':;.    .'.:do;;.    .c   ol;'.
 *       ';;'                   ;.;    ', .dkl';,    .c   :; .'.',::,,'''.
 *      ',,;;;,.                ; .,'     .'''.    .'.   .d;''.''''.
 *     .oxddl;::,,.             ',  .'''.   .... .'.   ,:;..
 *      .'cOX0OOkdoc.            .,'.   .. .....     'lc.
 *     .:;,,::co0XOko'              ....''..'.'''''''.
 *     .dxk0KKdc:cdOXKl............. .. ..,c....
 *      .',lxOOxl:'':xkl,',......'....    ,'.
 *           .';:oo:...                        .
 *                .cd,      ╔═╗┌┬┐┬┌┬┐┌─┐┬─┐    .
 *                  .l;     ║╣  │││ │ │ │├┬┘    '
 *                    'l.   ╚═╝─┴┘┴ ┴ └─┘┴└─   '.
 *                     .o.                   ...
 *                      .''''','.;:''.........
 *                           .'  .l
 *                          .:.   l'
 *                         .:.    .l.
 *                        .x:      :k;,.
 *                        cxlc;    cdc,,;;.
 *                       'l :..   .c  ,
 *                       o.
 *                      .,
 *
 *              ╦ ╦┬ ┬┌┐ ┬─┐┬┌┬┐  ╔═╗┌┐  ┬┌─┐┌─┐┌┬┐┌─┐
 *              ╠═╣└┬┘├┴┐├┬┘│ ││  ║ ║├┴┐ │├┤ │   │ └─┐
 *              ╩ ╩ ┴ └─┘┴└─┴─┴┘  ╚═╝└─┘└┘└─┘└─┘ ┴ └─┘
 *
 *
 * Created by Valentin on 10/22/14.
 *
 * Copyright (c) 2015 Valentin Heun
 *
 * All ascii characters above must be included in any redistribution.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
/*********************************************************************************************************************
 ******************************************** TODOS *******************************************************************
 **********************************************************************************************************************

 **
 * TODO
 **

 **********************************************************************************************************************
 ******************************************** constant settings *******************************************************
 **********************************************************************************************************************/

var httpPort = 8080;
var timeForContentLoaded = 240; // temporary set to 1000x with the UI Recording mode for video recording

/**********************************************************************************************************************
 ******************************************** global variables  *******************************************************
 **********************************************************************************************************************/

var globalStates = {
    width: window.screen.width,
    height: window.screen.height,
    guiButtonState: true,
    UIOffMode: false,
    preferencesButtonState: false,
    extendedTracking: false,

    extendedTrackingState: false,
    developerState: false,
    clearSkyState: false,
    externalState:"",
    sendMatrix3d:false,
    sendAcl:false,

    feezeButtonState: false,
    logButtonState: false,
    editingMode: false,
    guiURL: "",
    newURLText:"",
    platform: navigator.platform,
    lastLoop: 0,
    notLoading: "yes",
    drawDotLine: false,
    drawDotLineX: 0,
    drawDotLineY: 0,
    pointerPosition: [0, 0],
    projectionMatrix: [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ],
    editingModeHaveObject: false,
    angX: 0,
    angY: 0,
    unconstrainedPositioning:false
};

var globalCanvas = {};

var globalObjects = "";

var globalProgram = {
    ObjectA: false,
    locationInA: false,
    ObjectB: false,
    locationInB: false
};

var objectExp = {};

var globalMatrix = {};

function GlobalMatrix() {
    this.temp= mat4.fromValues([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
    this.temp2= mat4.fromValues([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
    this.begin= mat4.fromValues([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
    this.end = mat4.fromValues([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
    this.matrixtouchOn = false;
    this.copyStillFromMatrixSwitch = false;
}

var consoleText = "";
 var rotateX = [
     1, 0, 0, 0,
     0, -1, 0, 0,
     0, 0, 1, 0,
     0, 0, 0, 1
 ];

var testInterlink = {};

var mat4Result1 = mat4.create();
var mat4Result2 = mat4.create();
var mat4Result3 = mat4.create();
