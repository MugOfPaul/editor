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
 * TODO + Data is loaded from the Object
 * TODO + Generate and delete link
 * TODO + DRAw interface based on Object
 * TODO + Check the coordinates of targets. Incoperate the target size
 * TODO - Check if object is in the right range
 * TODO - add reset button on every target
 * TODO - Documentation before I leave
 * TODO - Arduino Library
 **

 /**********************************************************************************************************************
 ******************************************** Data IO *******************************************
 **********************************************************************************************************************/

// Functions to fill the data of the object

/**
 * @desc
 * @param
 * @param
 * @return
 **/

function addHeartbeatObject(beat) {
    /*
     if (globalStates.platform) {
     window.location.href = "of://gotbeat_" + beat.id;
     }
     */
    if (beat.id) {
        if (!objectExp[beat.id]) {
            getData('http://' + beat.ip + ':' + httpPort + '/object/' + beat.id, beat.id, function (req, thisKey) {
                objectExp[thisKey] = req;

                // this is a work around to set the state of an objects to not being visible.
                objectExp[thisKey].ObjectVisible = false;
                objectExp[thisKey].screenZ = 1000;

                console.log(objectExp[thisKey]);
            });
        }
    }
}

/**
 * @desc
 * @param
 * @param
 * @return
 **/

function setStates(developerState, extendedTrackingState, clearSkyState, externalState) {


    globalStates.extendedTrackingState = extendedTrackingState;
    globalStates.developerState = developerState;
    globalStates.clearSkyState = clearSkyState;
    globalStates.externalState = externalState;


    if (clearSkyState) {
        // globalStates.UIOffMode = true;
        timeForContentLoaded = 240000;
        // document.getElementById("turnOffUISwitch").checked = true;
    }

    if (developerState) {
        addEventHandlers();
        globalStates.editingMode = true;
        document.getElementById("editingModeSwitch").checked = true;
    }

    if (extendedTrackingState) {
        globalStates.extendedTracking = true;
        document.getElementById("extendedTrackingSwitch").checked = true;
    }


    if (globalStates.externalState !== "") {
        document.getElementById("newURLText").value = globalStates.externalState;
    }


    if(globalStates.editingMode) {
        document.getElementById('resetButton').style.visibility = "visible";
        document.getElementById('unconstButton').style.visibility = "visible";
        document.getElementById('resetButtonDiv').style.display = "inline";
        document.getElementById('unconstButtonDiv').style.display = "inline";
    }




    // Once all the states are send the alternative checkbox is loaded
    // Its a bad hack to place it here, but it works

    if(typeof checkBoxElements === "undefined") {
        var checkBoxElements = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

        checkBoxElements.forEach(function (html) {
            var switchery = new Switchery(html, {size: 'large', speed: '0.2s', color: '#1ee71e'});

        });
    }
}


/**
 * @desc
 * @param
 * @param
 * @return
 **/

function action(action) {
    var thisAction = JSON.parse(action);

    if (thisAction.reloadLink) {
        getData('http://' + thisAction.reloadLink.ip + ':' + httpPort + '/object/' + thisAction.reloadLink.id, thisAction.reloadLink.id, function (req, thisKey) {
            objectExp[thisKey].objectLinks = req.objectLinks;
            // console.log(objectExp[thisKey]);
            console.log("got links");
        });

    }

    if (thisAction.reloadObject) {
        getData('http://' + thisAction.reloadObject.ip + ':' + httpPort + '/object/' + thisAction.reloadObject.id, thisAction.reloadObject.id, function (req, thisKey) {
            objectExp[thisKey].x = req.x;
            objectExp[thisKey].y = req.y;
            objectExp[thisKey].scale = req.scale;
            objectExp[thisKey].objectValues = req.objectValues;

            // console.log(objectExp[thisKey]);
            console.log("got links");
        });
    }


    console.log("found action: " + action);

}

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param
 * @param
 * @return
 **/

function getData(url, thisKey, callback) {
    var req = new XMLHttpRequest();
    try {
        req.open('GET', url, true);
        // Just like regular ol' XHR
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                if (req.status >= 200 && req.status < 400) {
                    // JSON.parse(req.responseText) etc.
                    callback(JSON.parse(req.responseText), thisKey)
                } else {
                    // Handle error case
                    console.log("could not load content");
                }
            }
        };
        req.send();

    }
    catch (e) {
        console.log("could not connect to" + url);
    }
}


/**********************************************************************************************************************
 **********************************************************************************************************************/
// set projection matrix

/**
 * @desc
 * @param
 * @param
 * @return
 **/

function setProjectionMatrix(matrix) {

    //  generate all transformations for the object that needs to be done ASAP
    var scaleZ = mat4.clone([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 2, 0,
        0, 0, 0, 1
    ]);

    var viewportScaling = mat4.clone([
        globalStates.height, 0, 0, 0,
        0, -globalStates.width, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);

    //   var thisTransform = multiplyMatrix(scaleZ, matrix);
    mat4.multiply(projectionMatrix, matrix, scaleZ);
    mat4.multiply(projectionMatrix, viewportScaling, projectionMatrix);

    window.location.href = "of://gotProjectionMatrix";
}


/**********************************************************************************************************************
 ******************************************** update and draw the 3D Interface ****************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param
 * @param
 * @return
 **/

function update(objects) {
    if (globalStates.feezeButtonState == false) {
        globalObjects = objects;
    }
    /*if (consoleText !== "") {
        consoleText = "";
        document.getElementById("consolelog").innerHTML = "";
    }*/

    if (globalCanvas.hasContent === true) {
        globalCanvas.context.clearRect(0, 0, globalCanvas.canvas.width, globalCanvas.canvas.height);
        globalCanvas.hasContent = false;
    }

    for (var key in objectExp) {
        if (!objectExp.hasOwnProperty(key)) {
            continue;
        }

        var generalObject = objectExp[key];

        if (globalObjects.obj.hasOwnProperty(key)) {

            generalObject.visibleCounter = timeForContentLoaded;
            generalObject.ObjectVisible = true;

            mat4.copy(modelViewMatrix, globalObjects.obj[key]);
            mat4.multiply(modelViewMatrix, projectionMatrix, modelViewMatrix);
            mat4.multiply(modelViewMatrix, modelViewMatrix, rotateMatrixX);


            if (globalStates.guiButtonState || Object.keys(generalObject.objectValues).length === 0) {
                drawTransformed(generalObject, key, modelViewMatrix, key);
                addElement(generalObject, key, "http://" + generalObject.ip + ":" + httpPort + "/obj/" + key.slice(0, -12) + "/");
            }
            else {
                hideTransformed(generalObject, key, key);
            }

            for (var subKey in generalObject.objectValues) {
                // if (!generalObject.objectValues.hasOwnProperty(subKey)) { continue; }

                var tempValue = generalObject.objectValues[subKey];

                if (!globalStates.guiButtonState) {
                    drawTransformed(tempValue, subKey, modelViewMatrix, key);
                    addElement(tempValue, subKey, "http://" + generalObject.ip + ":" + httpPort + "/obj/dataPointInterfaces/" + tempValue.plugin + "/", key);
                } else {
                    hideTransformed(tempValue, subKey, key);
                }
            }
        }

        else {
            generalObject.ObjectVisible = false;

            hideTransformed(generalObject, key, key);

            for (var subKey in generalObject.objectValues) {
                // if (!generalObject.objectValues.hasOwnProperty(subKey)) {  continue;  }
                hideTransformed(generalObject.objectValues[subKey], subKey, key);
            }

            killObjects(generalObject, key);
        }

        if (globalStates.logButtonState) {
            consoleText += JSON.stringify(generalObject.objectLinks);
            consoleText += objectLog(key);
        }


    }

    // draw all lines
    if (!globalStates.guiButtonState && !globalStates.editingMode) {
        for (var keyT in objectExp) {
            drawAllLines(objectExp[keyT], globalCanvas.context);

        }
        drawInteractionLines();
    }

    if (globalStates.logButtonState) {
        generalLog(consoleText);
    }


}

/**********************************************************************************************************************
 ******************************************** 3D Transforms & Utilities ***********************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param
 * @param
 * @return
 **/

function drawTransformed(thisObject, thisKey, thisTransform2, generalKey) {

    if (globalStates.notLoading !== thisKey && thisObject.loaded === true) {

       var thisObjectKey = document.getElementById("thisObject" + thisKey);
       var iframeKey = document.getElementById("iframe" + thisKey)
        var justKey = document.getElementById(thisKey);
        var textKey;
        if (generalKey !== thisKey)
            textKey = document.getElementById("text" + thisKey);


        if (!thisObject.visible) {
            thisObjectKey.style.display = 'initial';
            iframeKey.style.visibility = 'visible';

            thisObject.visible = true;

            if (generalKey !== thisKey) {
                justKey.style.visibility = 'visible';
                textKey.style.visibility = 'visible';
            }


        }
        if (generalKey === thisKey) {
            if (globalStates.editingMode) {
                if (!thisObject.visibleEditing && thisObject.developer) {
                    thisObject.visibleEditing = true;
                    justKey.style.visibility = 'visible';

                    justKey.className = "mainProgram";
                }
            }
        }

        if(matrixtouchOn === thisKey && globalStates.editingMode) {
        //if(globalStates.unconstrainedPositioning===true)
             mat4.copy(temp, thisTransform2);

            if(copyStillFromMatrixSwitch){
                mat4.copy(visual, temp);
               if(typeof thisObject.matrix === "object") {
                    mat4.multiply(tempMatrix, temp, thisObject.matrix);
                    mat4.copy(begin, tempMatrix);
               }
               else
                    mat4.copy(begin, temp);
                copyStillFromMatrixSwitch = false;
            }

            if(globalStates.unconstrainedPositioning===true)
                thisTransform2 = visual;

        }

        matrix2dTransform[0] = thisObject.scale;
        matrix2dTransform[5] = thisObject.scale;
        matrix2dTransform[12] = thisObject.x;
        matrix2dTransform[13] = thisObject.y;

        if(typeof thisObject.matrix === "object"){
          // var thisMatrixTransform = mat4.clone(thisObject.matrix);
             mat4.multiply(finalTransform, thisTransform2, thisObject.matrix);
            mat4.multiply(finalTransform, finalTransform, matrix2dTransform);}
        else
            mat4.multiply(finalTransform, thisTransform2, matrix2dTransform);

        thisObjectKey.style.webkitTransform = 'matrix3d(' +
            finalTransform[0] + ',' + finalTransform[1] + ',' + finalTransform[2] + ',' + finalTransform[3] + ',' +
            finalTransform[4] + ',' + finalTransform[5] + ',' + finalTransform[6] + ',' + finalTransform[7] + ',' +
            finalTransform[8] + ',' + finalTransform[9] + ',' + finalTransform[10] + ',' + finalTransform[11] + ',' +
            finalTransform[12] + ',' + finalTransform[13] + ',' + finalTransform[14] + ',' + finalTransform[15] + ')';

        // this is for later
        // The matrix has been changed from Vuforia 3 to 4 and 5. Instead of  finalTransform[14] it is now finalTransform[15]
        thisObject.screenX = finalTransform[12] / finalTransform[15] + (globalStates.height / 2);
        thisObject.screenY = finalTransform[13] / finalTransform[15] + (globalStates.width / 2);
        thisObject.screenZ = finalTransform[14];

        var iFrameMsgContent = "";
        if (typeof thisObject.sendMatrix3d !== "undefined") {
            if (thisObject.sendMatrix3d === true) {
                iFrameMsgContent = '{"matrix":';
                iFrameMsgContent += JSON.stringify(Array.prototype.slice.call(finalTransform));
            }

        }

        if (typeof globalObjects.acl !== "undefined") {
            if (typeof thisObject.sendAcl !== "undefined") {
                if (thisObject.sendAcl === true) {
                    if (iFrameMsgContent !== "")  iFrameMsgContent += ","; else  iFrameMsgContent += "{";
                    iFrameMsgContent += '"acl":';
                    iFrameMsgContent += JSON.stringify(globalObjects.acl);
                }
            }
        }

        if (iFrameMsgContent !== "") {
            iframeKey.contentWindow.postMessage(
            iFrameMsgContent + '}', '*');}
    }
}

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param
 * @param
 * @return
 **/

function hideTransformed(thisObject, thisKey, generalKey) {
    if (thisObject.visible === true) {
        document.getElementById("thisObject" + thisKey).style.display = 'none';
        document.getElementById("iframe" + thisKey).style.visibility = 'hidden';
        //document.getElementById("iframe" + thisKey).style.display = 'none';
        document.getElementById("text" + thisKey).style.visibility = 'hidden';
        //document.getElementById("text" + thisKey).style.display = 'none';
        thisObject.visible = false;
        thisObject.visibleEditing = false;
        document.getElementById(thisKey).style.visibility = 'hidden';
        //document.getElementById(thisKey).style.display = 'none';

    }

    /*
     if (thisObject.visibleEditing === true) {
     //  console.log(thisKey);
     thisObject.visibleEditing = false;
     document.getElementById(thisKey).style.visibility = 'hidden';
     }*/
}

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param
 * @param
 * @return
 **/

function addElementInPreferences() {

    var htmlContent = "";


    htmlContent += "<div class='Interfaces'" +
        " style='position: relative;  float: left; height: 20px; width: 35%; text-align: center; font-family: Helvetica Neue, Helvetica, Arial;background-color: #a0a0a0; -webkit-transform-style: preserve-3d;'>" +
        "Name</div>";
    htmlContent += "<div class='Interfaces'" +
        " style='position: relative;  float: left; height: 20px; width: 30%; text-align: center; font-family: Helvetica Neue, Helvetica, Arial;background-color: #a0a0a0; -webkit-transform-style: preserve-3d;'>" +
        "IP</div>";

    htmlContent += "<div class='Interfaces'" +
        " style='position: relative;  float: left; height: 20px; width: 16%; text-align: center; font-family: Helvetica Neue, Helvetica, Arial;background-color: #a0a0a0; -webkit-transform-style: preserve-3d; '>" +
        "Version</div>";

    htmlContent += "<div class='Interfaces'" +
        " style='position: relative;  float: left; height: 20px; width: 7%; text-align: center; font-family: Helvetica Neue, Helvetica, Arial; background-color: #a0a0a0;-webkit-transform-style: preserve-3d;'>" +
        "I/O</div>";

    htmlContent += "<div class='Interfaces'" +
        " style='position: relative;  float: left; height: 20px; width: 12%; text-align: center; font-family: Helvetica Neue, Helvetica, Arial; background-color: #a0a0a0;-webkit-transform-style: preserve-3d;'>" +
        "Links</div>";

    var bgSwitch = false;
    var bgcolor = "";
    for (var keyPref in objectExp) {

        if (bgSwitch) {
            bgcolor = "background-color: #a0a0a0;";
            bgSwitch = false;
        } else {
            bgcolor = "background-color: #aaaaaa;";
            bgSwitch = true;
        }

        htmlContent += "<div class='Interfaces' id='" +
            "name" + keyPref +
            "' style='position: relative;  float: left; height: 20px; width: 35%; text-align: center; font-family: Helvetica Neue, Helvetica, Arial;" + bgcolor + " -webkit-transform-style: preserve-3d; " +
            "'>" +
            keyPref.slice(0, -12)
            + "</div>";

        htmlContent += "<div class='Interfaces' id='" +
            "name" + keyPref +
            "' style='position: relative;  float: left; height: 20px; width: 30%; text-align: center; font-family: Helvetica Neue, Helvetica, Arial;" + bgcolor + " -webkit-transform-style: preserve-3d; " +
            "'>" +
            objectExp[keyPref].ip
            + "</div>";

        htmlContent += "<div class='Interfaces' id='" +
            "version" + keyPref +
            "' style='position: relative;  float: left; height: 20px; width: 16%; text-align: center; font-family: Helvetica Neue, Helvetica, Arial; " + bgcolor + "-webkit-transform-style: preserve-3d;" +
            "'>" +
            objectExp[keyPref].version
            + "</div>";

        var anzahl = 0;

        for (var subkeyPref2 in objectExp[keyPref].objectValues) {
            anzahl++;
        }

        htmlContent += "<div class='Interfaces' id='" +
            "io" + keyPref +
            "' style='position: relative;  float: left; height: 20px; width: 7%;  text-align: center; font-family: Helvetica Neue, Helvetica, Arial;" + bgcolor + "-webkit-transform-style: preserve-3d;" +
            "'>" +
            anzahl
            + "</div>";


        anzahl = 0;

        for (var subkeyPref in objectExp[keyPref].objectLinks) {
            anzahl++;
        }

        htmlContent += "<div class='Interfaces' id='" +
            "links" + keyPref +
            "' style='position: relative;  float: left; height: 20px; width: 12%; text-align: center;  font-family: Helvetica Neue, Helvetica, Arial;" + bgcolor + "-webkit-transform-style: preserve-3d;" +
            "'>" +
            anzahl
            + "</div>";

    }

    document.getElementById("content2").innerHTML = htmlContent;

}
/*
 <div class='Interfaces'
 style="position: relative; float: left; height: 30px; width: 25%; -webkit-transform-style: preserve-3d;  visibility: visible;
 background-color: #ff3fd4;"></div>
 */

/**
 * @desc
 * @param
 * @param
 * @return
 **/

function addElement(thisObject, thisKey, thisUrl, generalObject) {
    if (globalStates.notLoading !== true && globalStates.notLoading !== thisKey && thisObject.loaded !== true) {

        if (typeof generalObject === 'undefined') {
            generalObject = thisKey;
        }

        thisObject.loaded = true;
        thisObject.visibleEditing = false;
        globalStates.notLoading = thisKey;
        //  window.location.href = "of://objectloaded_" + globalStates.notLoading;

        var addDoc = document.createElement('div');
        addDoc.id = "thisObject" + thisKey;
        addDoc.style.width = globalStates.height + "px";
        addDoc.style.height = globalStates.width + "px";
        addDoc.style.display = "none";
        addDoc.style.border = 0;
        addDoc.className = "main";
        document.getElementById("GUI").appendChild(addDoc);


        var tempAddContent =
            "<iframe id='iframe" + thisKey + "' onload='on_load(\"" +
            generalObject + "\",\"" + thisKey + "\")' frameBorder='0' " +
            "style='width:" + thisObject.frameSizeX + "px; height:" + thisObject.frameSizeY + "px;" +
            "top:" + ((globalStates.width - thisObject.frameSizeX) / 2) + "px; left:" +
            ((globalStates.height - thisObject.frameSizeY) / 2) + "px; visibility: hidden;' " +
            "src='" + thisUrl + "' class='main' sandbox='allow-forms allow-pointer-lock allow-same-origin allow-scripts'>" +
            "</iframe>";

        tempAddContent += "<div id='" + thisKey + "' frameBorder='0' style='width:" + thisObject.frameSizeX + "px; height:" + thisObject.frameSizeY + "px;" +
            "top:" + ((globalStates.width - thisObject.frameSizeX) / 2) + "px; left:" + ((globalStates.height - thisObject.frameSizeY) / 2) + "px; visibility: hidden;' class='mainEditing'></div>" +
            "";

        tempAddContent += "<div id='text" + thisKey + "' frameBorder='0' style='width:5px; height:5px;" +
            "top:" + ((globalStates.width) / 2 + thisObject.frameSizeX / 2) + "px; left:" + ((globalStates.height - thisObject.frameSizeY) / 2) + "px; visibility: hidden;' class='mainProgram'><font color='white'>" + thisObject.name + "</font></div>" +
            "";

        document.getElementById("thisObject" + thisKey).innerHTML = tempAddContent;
        var theObject = document.getElementById(thisKey);
        theObject.style["touch-action"] = "none";
        theObject["handjs_forcePreventDefault"] = true;
        theObject.addEventListener("pointerdown", touchDown, false);
        theObject.addEventListener("pointerup", trueTouchUp, false);
        if (globalStates.editingMode) {
            if (objectExp[generalObject].developer) {
                theObject.addEventListener("touchstart", MultiTouchStart, false);
                theObject.addEventListener("touchmove", MultiTouchMove, false);
                theObject.addEventListener("touchend", MultiTouchEnd, false);
                theObject.className = "mainProgram";
            }
        }
        theObject.ObjectId = generalObject;
        theObject.location = thisKey;

        if (thisKey !== generalObject) {
            theObject.style.visibility = "visible";
            // theObject.style.display = "initial";
        }
        else {
            theObject.style.visibility = "hidden";
            //theObject.style.display = "none";
        }
    }
}

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param
 * @param
 * @return
 **/

function killObjects(thisObject, thisKey) {

    if (thisObject.visibleCounter > 0) {
        thisObject.visibleCounter--;
    } else if (thisObject.loaded) {
        thisObject.loaded = false;

        var tempElementDiv = document.getElementById("thisObject" + thisKey);
        tempElementDiv.parentNode.removeChild(tempElementDiv);

        for (var subKey in thisObject.objectValues) {
            try {
                tempElementDiv = document.getElementById("thisObject" + subKey);
                tempElementDiv.parentNode.removeChild(tempElementDiv);
            } catch (err) {
                console.log("could not find any");
            }
            thisObject.objectValues[subKey].loaded = false;
        }
    }
}

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param
 * @param
 * @return
 **/

function on_load(generalObject, thisKey) {
    globalStates.notLoading = false;
    // window.location.href = "of://event_test_"+thisKey;

    // console.log("posting Msg");
    var iFrameMessage_ = JSON.stringify({
        obj: generalObject,
        pos: thisKey,
        objectValues: objectExp[generalObject].objectValues
    });
    document.getElementById("iframe" + thisKey).contentWindow.postMessage(
        iFrameMessage_, '*');
}

function fire(thisKey) {
    // globalStates.notLoading = false;
    window.location.href = "of://event_" + this.location;

}

